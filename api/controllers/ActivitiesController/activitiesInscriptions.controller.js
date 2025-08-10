import { studentExists, activityExists, registerStudentModel, unsubscribeStudentModel, closeInscriptionsModel } from "../../models/activitiesModel/activitiesInscriptions.model.js";
import { calculateAllStudentsVOAE } from "../../utils/activities/horasVOAECalculator.js";

export class ActivitiesInscriptionsController {
    static registeStudentinActivity = async (req, res) => {
    
        const {id,activityid} = req.params

       try{

           const student = await studentExists(id);
           const activity = await activityExists(activityid);

           if (student.length === 0) {
               return res.status(404).json({ message: "Estudiante no encontrado" });
           }

           if (activity.length === 0) {
               return res.status(404).json({ message: "Actividad no encontrada" });
           }

           await registerStudentModel(id,activityid)

           res.status(200).json({ message: "Estudiante registrado en la actividad con éxito" });

       } catch (error) {
           res.status(500).json({message:'Hubo un problema al registrar al estudiante', error})
       }
    }

    static unsubscribeStudentinActivity = async (req,res) => {

        const {activityid, id} = req.params;

        try{

           const student = await studentExists(id);
           const activity = await activityExists(activityid);

           if (student.length === 0) {
               return res.status(404).json({ message: "Estudiante no encontrado" });
           }

           if (activity.length === 0) {
               return res.status(404).json({ message: "Actividad no encontrada" });
           }

           await unsubscribeStudentModel(id, activityid);

           res.status(200).json({ message: "Estudiante desuscrito de la actividad con éxito" });

       } catch (error) {
           res.status(500).json({message:'Hubo un problema al desuscribir al estudiante', error})
       }
    }

    static closeInscriptions = async (req,res) => {
        const {id} = req.params;
       
        try{

            const activity = await activityExists(id);

            if (activity.length === 0) {
                return res.status(404).json({ message: "Actividad no encontrada" });
            }

            await closeInscriptionsModel(id);

            return res.json({ message: "Las inscripciones han sido cerradas con éxito" });

        } catch (error) {
            res.status(500).json({message:'Hubo un problema al cerrar las inscripciones', error})
        }
    }

    static closeActivity = async (req, res) => {

        const {id} = req.params;

        try {

            const activity = await activityExists(id);

            if (activity.length === 0) {
                return res.status(404).json({ message: "Actividad no encontrada" });
            }

            
            await calculateAllStudentsVOAE(id);

            res.json({ message: 'La actividad ha sido cerrada con éxito' });

        }
        catch (error) {
            res.status(500).json({message:'Hubo un problema al cerrar la actividad', error}) 
        }

    }
}