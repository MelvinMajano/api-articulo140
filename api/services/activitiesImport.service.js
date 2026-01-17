import XLSX from "xlsx";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "../config/prisma";
import { validateExcelRows } from "../schemas/ActivitiesSchema/excelImportSchema";

const DEFAULT_DEGREE_ID = 1;
const toUnique = (arr) => [...new Set(arr.filter(Boolean))];
const buildRowError = (rowNumber, message) => ({ row: rowNumber, message });

const parseBuffer = (buffer) => { 
    try{
        const workbook = XLSX.read(buffer, {type:"buffer"});
        const sheetName = workbook.SheetNames[0];

        if(!sheetName){
            throw new Error("El archivo no contiene hojas válidas");
        }
        const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {defval:""});
        if(data.length===0){
            throw new Error("El archivo está vacío");
        }
        return data;
    }catch(error){
        throw new Error(`Error al leer el archivo Excel: ${error.message}`);
    }
};
const sanitizeRows = (rows) => rows.map((row) => ({
    ...row,
    accountNumber: row.accountNumber != null ? String(row.accountNumber).trim() : row.accountNumber,
    name: row.name != null ? String(row.name).trim() : row.name,
    email: row.email != null ? String(row.email).trim() : row.email,
    identityNumber: row.identityNumber != null ? String(row.identityNumber).trim() : row.identityNumber,
    degreeCode: row.degreeCode != null ? String(row.degreeCode).trim() : row.degreeCode,
    observations: row.observations != null ? String(row.observations).trim() : row.observations,
  }));

export const processImportFile = async (buffer, activityId, { allowFinishedImport = false } = {}) => {
    const parsedRows = sanitizeRows(parseBuffer(buffer));
    const { validRows, errors: validationErrors } = validateExcelRows(parsedRows);

    if (validRows.length === 0) {
        return { created: 0, existing: 0, registered: 0, attendanceSaved: 0, errors: validationErrors };
    }

    const accountNumbers = toUnique(validRows.map(r => r.accountNumber));
    const degreeCodes = toUnique(validRows.map(r => r.degreeCode).filter(Boolean));

    try {
        const result = await prisma.$transaction(async (tx) => {
            const [existingUsers, degrees, activity] = await Promise.all(
                [
                    tx.users.findMany({
                        where: { accountNumber: { in: accountNumbers } },
                        select: { id: true, accountNumber: true }
                    }),
                    tx.degrees.findMany({
                        where: { code: { in: degreeCodes } },
                        select: { id: true, code: true }
                    }),
                    tx.activities.findUnique({
                        where: { id: activityId },
                        select: { id: true, status: true, availableSpots: true }
                    })
                ]
            )

            if (!activity) {
                return {
                    created: 0, existing: 0, registered: 0, attendanceSaved: 0,
                    errors: [{ row: null, message: "actividad no encontrada" }]
                };
            }

            if (allowFinishedImport && activity.status !== 'finished') {
                return {
                    created: 0, existing: 0, registered: 0, attendanceSaved: 0,
                    errors: [{ row: null, message: "La actividad debe estar finalizada para importar asistencias" }]
                };
            }

            const existingMap = new Map(existingUsers.map(u => [u.accountNumber, u.id]));
            const degreeMap = new Map(degrees.map(d => [d.code, d.id]));
            const newRows = validRows.filter(r => !existingMap.has(r.accountNumber));

            const seenEmails = new Set();
            const seenIdentities = new Set();
            const rowsToCreate = [];
            const preCreateErrors = [];

            for (const row of newRows) {
                if (seenEmails.has(row.email)) {
                    preCreateErrors.push(buildRowError(row.rowNumber, "Email duplicado en el archivo"));
                    continue;
                }
                if (row.identityNumber && seenIdentities.has(row.identityNumber)) {
                    preCreateErrors.push(buildRowError(row.rowNumber, "Cédula duplicada en el archivo"));
                    continue;
                }
                seenEmails.add(row.email);
                if (row.identityNumber) seenIdentities.add(row.identityNumber);
                rowsToCreate.push(row);
            }

            let createdCount = 0;
            const createdMap = new Map();
            if (rowsToCreate.length > 0) {
                const usersToCreate = rowsToCreate.map(row => {
                    const id = uuidv4();
                    createdMap.set(row.accountNumber, id);
                    return {
                        id,
                        name: row.name,
                        email: row.email,
                        password: bcrypt.hashSync(String(row.accountNumber), 10),
                        accountNumber: row.accountNumber,
                        identityNumber: row.identityNumber || null,
                        role: 'student',
                        degreeId: degreeMap.get(row.degreeCode) || DEFAULT_DEGREE_ID,
                        isDeleted: false,
                    }
                });
                const createResult = await tx.users.createMany({
                    data: usersToCreate
                });
                createdCount = createResult.count;
            }

            const studentMap = new Map([...existingMap, ...createdMap]);
            const allStudentIds = accountNumbers.map(acc => studentMap.get(acc)).filter(Boolean);

            const existingRegistrations = await tx.registrations.findMany({
                where: { activityId, studentId: { in: allStudentIds } },
                select: { studentId: true }
            })

            const alreadyRegisteredSet = new Set(existingRegistrations.map(r => r.studentId));
            const toRegister = allStudentIds.filter(id => !alreadyRegisteredSet.has(id));

            let registeredIds = [...alreadyRegisteredSet];
            const skipped = [];

            let allowedCount = 0;
            if (toRegister.length > 0) {
                allowedCount = allowFinishedImport ? toRegister.length : Math.min(Number(activity.availableSpots) || 0, toRegister.length);
            }

            if (allowedCount > 0) {
                await tx.registrations.createMany({
                    data: toRegister.slice(0, allowedCount).map(id => ({
                        studentId: id,
                        activityId
                    })),
                    skipDuplicates: true
                });

                registeredIds.push(...toRegister.slice(0, allowedCount));
            }

            if (!allowFinishedImport) {
                await tx.activities.update({
                    where: { id: activityId },
                    data: { availableSpots: { decrement: allowedCount } }
                })
            }

            if (!allowFinishedImport && allowedCount < toRegister.length) {
                skipped.push(...toRegister.slice(allowedCount));
            }

            const registeredSet = new Set(registeredIds);
            const attendances = [];
            const attendanceErrors = [];

            for (const row of validRows) {
                const studentId = studentMap.get(row.accountNumber);
                if (!studentId) {
                    attendanceErrors.push(buildRowError(row.rowNumber, "No se pudo obtener el estudiante"));
                    continue;
                }

                if (!registeredSet.has(studentId)) {
                    attendanceErrors.push(buildRowError(row.rowNumber, "Estudiante no inscrito (sin cupos o actividad cerrada)"));
                    continue;
                }

                attendances.push({
                    id: uuidv4(),
                    studentId,
                    activityId,
                    entryTime: new Date(row.entryTime),
                    exitTime: new Date(row.exitTime),
                    observations: row.observations || null
                });
            }

            let attendanceSaved = 0;
            if (attendances.length > 0) {
                const attResult = await tx.attendances.createMany({
                    data: attendances
                });
                attendanceSaved = attResult.count;
            }

            return {
                created: createdCount,
                existing: existingUsers.length,
                registered: registeredIds.length,
                attendanceSaved,
                errors: [
                    ...validationErrors,
                    ...preCreateErrors,
                    ...skipped.map(() => ({ row: null, message: "Sin cupo disponible" })),
                    ...attendanceErrors
                ]
            };
        });

        return result;

    } catch (error) {
        if (error.code === 'P2002') {
            const field = error.meta?.target?.[0] || 'desconocido';
            return {
                created: 0, existing: 0, registered: 0, attendanceSaved: 0,
                errors: [{
                    row: null,
                    message: `Algunos registros tienen ${field} duplicados. Verifica el archivo y reintenta.`
                }]
            };
        }
        throw error;
    }
}