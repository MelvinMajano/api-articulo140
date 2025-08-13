import { validateAttendances } from "../../schemas/ActivitiesSchema/activitiesAttendanceSchema.js";
import { v4 as uuidv4 } from "uuid";
import { registerAttendanceModel, getAttendanceModel} from "../../models/activitiesModel/activitiesAttendance.model.js";
import { formatDateHonduras } from "../../utils/activities/formatDateHonduras.js";
import { successResponse, erroResponse } from "../../utils/responseHandler.js";

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

        const {activityid} = req.params

        try {

            const response = await getAttendanceModel(activityid);

            if (response.length === 0) {
                return erroResponse(res, 404, 'No se encontraron registros de asistencia para esta actividad');
            }

            const formattedsAttendances = response.map(attendance => ({
                ...attendance,
                entryTime: formatDateHonduras(attendance.entryTime),
                exitTime: formatDateHonduras(attendance.exitTime),
            }));

            return successResponse(res, 200, formattedsAttendances);

        } catch (error) {
            return erroResponse(res, 500, 'Hubo un problema al obtener la asistencia', error);
        }
    }
}