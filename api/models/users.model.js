import { pool } from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

export const CurrentActivitiesDB=async (accountNumber)=>{
    const query = ` SELECT 
    u.name AS studentName,
    GROUP_CONCAT(a.title ORDER BY a.startDate SEPARATOR ', ') AS activitiesParticipated
FROM registrations r
INNER JOIN activities a 
    ON r.activityId = a.id
INNER JOIN users u
    ON r.studentId = u.id
WHERE u.accountNumber = ? or u.id = ? or identityNumber = ?
  AND a.status = 'finished'
GROUP BY u.id, u.name;`

    const [result] = await pool.query(query,[accountNumber,accountNumber,accountNumber])
    return result
}

export const VOAEHours = async (id) => {
   const query = `
SELECT 
    u.name AS studentName,
    COALESCE(SUM(CASE WHEN s.scope = 'cultural' THEN at.hoursAwarded ELSE 0 END), 0) AS culturalHours,
    COALESCE(SUM(CASE WHEN s.scope = 'cientificoAcademico' THEN at.hoursAwarded ELSE 0 END), 0) AS cientificoAcademicoHours,
    COALESCE(SUM(CASE WHEN s.scope = 'deportivo' THEN at.hoursAwarded ELSE 0 END), 0) AS deportivoHours,
    COALESCE(SUM(CASE WHEN s.scope = 'social' THEN at.hoursAwarded ELSE 0 END), 0) AS socialHours,
    COALESCE(SUM(at.hoursAwarded), 0) AS totalHours
FROM users u
LEFT JOIN registrations r 
    ON u.id = r.studentId
LEFT JOIN attendances at
    ON r.studentId = at.studentId 
    AND r.activityId = at.activityId
LEFT JOIN activities a 
    ON r.activityId = a.id 
    AND a.status = 'finished'
LEFT JOIN activityScopes s
    ON a.id = s.activityId
    WHERE 
        u.id = ?
        OR u.accountNumber = ?
        OR u.identityNumber = ?
    GROUP BY u.id, u.name
    ORDER BY u.name;
`;
   const [result] = await pool.query(query, [id, id, id]);
   return result;
};


export const getStudentsModel = async () => {

    const cnn = await pool.getConnection()

    const query = `select u.id,u.name, u.email, u.accountNumber, u.identityNumber, d.name as career from users as u 
   inner join degrees as d on u.degreeId = d.id
   where u.role = 'student' and u.isDeleted = 'false'`

    const [result] = await cnn.query(query)

    return result
}

export const getSupervisorsModel = async () => {

    const cnn = await pool.getConnection()

    const query = `select u.id, u.name, u.email, u.accountNumber, u.identityNumber, d.name as career, u.isDeleted from users as u
   inner join degrees as d on u.degreeId = d.id
   where u.role = 'supervisor'`

    const [result] = await cnn.query(query)

    return result
}

export const getCareersModel = async () => {

    const cnn = await pool.getConnection()

    const query = `select d.id, d.code, d.name, d.faculty from degrees as d`

    const [result] = await cnn.query(query)

    return result
}

export const disableSupervisorModel = async (id) => {

    const cnn = await pool.getConnection()

    const query = `update users set isDeleted = true where accountNumber = ? and role = 'supervisor'`
    const [result] = await cnn.query(query, [id])
    return result
}

export const enableSupervisorModel = async (id) => {

    const cnn = await pool.getConnection()

    const query = `update users set isDeleted = 'false' where accountNumber = ? and role = 'supervisor'`
    const [result] = await cnn.query(query, [id])
    return result
}

export const registerActivityForStudentModel = async(activityId, studentId) => {
    const cnn = await pool.getConnection();
    await cnn.beginTransaction();

    try {
        const queryCheckRegistration = `
            SELECT studentId FROM registrations 
            WHERE studentId = ? AND activityId = ?
        `;
        const [existingRegistration] = await cnn.query(queryCheckRegistration, [studentId, activityId]);
        
        if (existingRegistration && existingRegistration.length > 0) {
            await cnn.rollback();
            return {
                success: false,
                isDuplicate: true,
                message: 'El estudiante ya está registrado en esta actividad'
            };
        }

        const queryActivityInfo = `
            SELECT 
                a.voaeHours,
                a.startDate,
                a.endDate,
                COUNT(s.scope) as scopeCount,
                a.status
            FROM activities a
            LEFT JOIN activityScopes s ON a.id = s.activityId
            WHERE a.id = ?
            GROUP BY a.id, a.voaeHours, a.startDate, a.endDate, a.status
        `;
        
        const [rows] = await cnn.query(queryActivityInfo, [activityId]);
        
        if (!rows || rows.length === 0) {
            throw new Error('Actividad no encontrada');
        }

        const activityInfo = rows[0];

        if (activityInfo.status !== 'finished') {
            throw new Error('La actividad no ha sido finalizada');
        }

        const voaeHours = activityInfo.voaeHours;
        const scopeCount = activityInfo.scopeCount || 1;
        const startDate = activityInfo.startDate;
        const endDate = activityInfo.endDate;

        const queryRegistration = `
            INSERT INTO registrations (studentId, activityId, registrationDate) 
            VALUES (?, ?, CURDATE())
        `;
        await cnn.query(queryRegistration, [studentId, activityId]);

        
        const attendanceId = uuidv4();

        
        const queryAssistance = `
            INSERT INTO attendances (id, studentId, activityId, entryTime, exitTime, hoursAwarded) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        await cnn.query(queryAssistance, [
            attendanceId,  
            studentId, 
            activityId, 
            startDate,     
            endDate,       
            voaeHours      
        ]);

        await cnn.commit();
        
        return {
            success: true,
            isDuplicate: false,
            message: 'Estudiante registrado exitosamente',
            hoursAwarded: voaeHours,
            scopeCount: scopeCount
        };

    } catch (error) {
        await cnn.rollback();
        throw error;
    } finally {
        cnn.release();
    }
}