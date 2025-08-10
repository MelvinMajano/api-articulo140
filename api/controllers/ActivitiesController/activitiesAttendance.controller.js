import { validateAttendance } from "../../schemas/ActivitiesSchema/activitiesAttendanceSchema.js";
import { v4 as uuidv4 } from "uuid";
import { registerAttendanceModel, getAttendanceModel, updateAttendanceModel } from "../../models/activitiesModel/activitiesAttendance.model.js";

export class ActivitiesAttendanceController {
    static createAttendance = async (req, res) => {
        const data = req.body
        const {registerid} = req.params

        const {success,error,data:safedata} = await validateAttendance(data);
        if(!success){
            return res.status(400).json({message:'Hubo un error al validar la data',error});
        }

        safedata.id = uuidv4();
        safedata.registro_id = registerid;

        try {
            const response = await registerAttendanceModel(safedata,);

            res.json({message:'Asistencia registrada con éxito'});

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

            res.json(response);

        } catch (error) {
            res.status(500).json({message:'Hubo un problema al obtener la asistencia', error});
        }
    }

    static updateUserAttendance = async (req,res) => {

        const {activityid, userid} = req.params
        const data = req.body;

        const {success,error} = await validateAttendance(data);
        if(!success){
            return res.status(400).json({message:'Los datos de asistencia son inválidos',error});
        }

        try {

            const response = await updateAttendanceModel(activityid, userid, data);

            if (response.affectedRows === 0) {
                return res.status(404).json({message: 'No se encontró el registro de asistencia para actualizar'});
            }

            res.json({message: 'Asistencia actualizada con éxito'});

        } catch (error) {
            res.status(500).json({message:'Hubo un problema al actualizar la asistencia del usuario', error});
        }

    }
}