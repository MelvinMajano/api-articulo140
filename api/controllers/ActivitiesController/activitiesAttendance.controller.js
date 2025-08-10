import { validateAttendances } from "../../schemas/ActivitiesSchema/activitiesAttendanceSchema.js";
import { v4 as uuidv4 } from "uuid";
import { registerAttendanceModel, getAttendanceModel} from "../../models/activitiesModel/activitiesAttendance.model.js";
import { formatDateHonduras } from "../../utils/activities/formatDateHonduras.js";

export class ActivitiesAttendanceController {

    static createAttendance = async (req, res) => {
        const data = req.body

        const parsed = await validateAttendances(data);

        if(!parsed.success){
            return res.status(400).json({message:'Hubo un error al validar la data', error: parsed.error.format()});
        }

        const safeData = parsed.data.attendances.map(attendance => ({
              id: uuidv4(),
              ...attendance
        }));

        try {
            const response = await registerAttendanceModel(safeData);

            res.json({message:'Asistencias registradas con éxito'});

        } catch (error) {
            res.status(500).json({message:'Hubo un problema al crear la asistencia', error});
        }
    }

    static viewAttendancebyId = async (req,res) => {

        const {activityid} = req.params

        try {

            const response = await getAttendanceModel(activityid);

            if (response.length === 0) {
                return res.status(404).json({message: 'No se encontraron registros de asistencia para esta actividad'});
            }

            const formattedsAttendances = response.map(attendance => ({
                ...attendance,
                entryTime: formatDateHonduras(attendance.entryTime),
                exitTime: formatDateHonduras(attendance.exitTime),
                
            }));
            
            res.json(formattedsAttendances);

        } catch (error) {
            res.status(500).json({message:'Hubo un problema al obtener la asistencia', error});
        }
    }
}