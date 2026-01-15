import { validateAttendances } from "../../schemas/ActivitiesSchema/activitiesAttendanceSchema.js";
import { v4 as uuidv4 } from "uuid";
import { registerAttendanceModel, getAttendanceModel, TotalAttendanceModel} from "../../models/activitiesModel/activitiesAttendance.model.js";
import { formatDateHonduras } from "../../utils/activities/formatDateHonduras.js";
import { successResponse, erroResponse } from "../../utils/responseHandler.js";
import { validateOptions } from "../../utils/activities/validateOptionsPaination.js";

export class ActivitiesAttendanceController {

    static createAttendance = async (req, res) => {
        const data = req.body

        const parsed = await validateAttendances(data);

        if(!parsed.success){
            return erroResponse(res, 400, 'Hubo un error al validar la data', parsed.error.format());
        }

        const safeData = parsed.data.attendances.map(attendance => ({
              id: uuidv4(),
              ...attendance
        }));

        try {
            
            await registerAttendanceModel(safeData);

            return successResponse(res, 200, 'Asistencias registradas con éxito');

        } catch (error) {
            return erroResponse(res, 500, 'Hubo un problema al crear la asistencia', error);
        }
    }

    static viewAttendancebyId = async (req,res) => {
        const {page,limit} = req.query;
        const {validatePage,validateLimit} = validateOptions(page,limit)
        const {activityid} = req.params 

        const offset = (validatePage - 1) * validateLimit;
        const options = {
            validatePage,
            validateLimit,
            offset,
            activityid
        }

        try {
            const response = await getAttendanceModel(options);
            
            if (response.length === 0) {
                return erroResponse(res, 404, 'No se encontraron registros de asistencia para esta actividad');
            }

            const formattedsAttendances = response.map(attendance => ({
                ...attendance,
                entryTime: formatDateHonduras(attendance.entryTime),
                exitTime: formatDateHonduras(attendance.exitTime),
            }));

            const countResult = await TotalAttendanceModel();
            const total = countResult[0].total;

            const result = {
                data:formattedsAttendances,
                pagination:{
                    total,
                    page,
                    limit,
                    totalPage:Math.ceil(total/limit)
                }
            }

            return successResponse(res, 200, result);

        } catch (error) {
            return erroResponse(res, 500, 'Hubo un problema al obtener la asistencia', error);
        }
    }


    static importFile = async(req,res)=>{
        const {activityId} = req.params

        if(!req.file || !req.file.buffer){
            return erroResponse(res,400, "archivo no enviado o vacio")
        }

        try{
            const result= await processImportFile(req.file.buffer,activityId,{allowFinishedImport: true});
            return successResponse(res, 200, "Importacion completada", result);
        }catch(error){
            return erroResponse(res, 500, "Hubo un problema al importar el archivo", error.message || error);
        }
    };
}