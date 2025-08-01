import { crearActividadModel, deleteActividadByidModel, getActividadbyIdModel, getActividadModel, putActividadbyidModel} from "../models/activitiesModel/activities.model.js"
import { registerAttendanceModel } from "../models/activitiesModel/activitiesAttendance.model.js";
import { getActivitiesFilesModel, postActivitiesFilesModel } from "../models/activitiesModel/activitiesFile.model.js";
import { validateFile } from "../schemas/ActivitiesSchema/activitiesFileShema.js";
import { validateAttendance } from "../schemas/ActivitiesSchema/activitiesAttendanceSchema.js";
import { validateActividad, validateActividadput } from "../schemas/ActivitiesSchema/activitiesSchema.js"
import { registerStudentModel, unsubscribeStudentModel, closeInscriptionsModel, closeActivityModel } from "../models/activitiesModel/activitiesInscripciones.model.js";
import { v4 as uuidv4 } from "uuid";

export class ActivitiesController {
    static getActividadController =async(req,res)=>{
        
         try {
            const actividades = await getActividadModel();

            if (actividades.length === 0) {
                return res.status(404).json({message: 'No se encontraron actividades'});
            }

            res.json(actividades);

        } catch (error) {
            res.status(500).json({message: 'Error al obtener las actividades', error});
        }
    }

    static getActividadbyIdController = async(req,res)=>{

        const {id} = req.params;
        try {
            const actividad =  await getActividadbyIdModel(id);

            if (actividad.length === 0) {
                return res.status(404).json({message: 'Actividad no encontrada'});
            }

            res.status(200).json(actividad);
        } catch (error) {
            res.status(400).json({message:'Hubo un problema al obtener la actividad '},error)
        }
    }

    static crearActividadController =async(req,res)=>{

        const actividadResivida = req.body;
        const {success,error,data} =await validateActividad(actividadResivida);

        if(!success){
            res.status(404).json({message:`Error al validar la data: ${error}`})
        }

        data.id = uuidv4()
        data.carreraid = 1
        data.estadoId=1

        try {
            await crearActividadModel(data);
            res.status(201).json({message:`Actividad creada con exito`});
        } catch (error) {
            res.status(400).json({message:`hubo un error al crear la data`,error})
        }
    }

    static putActividadbyidController = async(req,res)=>{
        const {id} = req.params;
        const data = req.body;
        data.actividadId=id;
        const {success,error,data:safedata}=await validateActividadput(data);

        if(!success){
            return res.status(400).json({message:`Hubo un error al validar la data`,error}) 
        }
        
        try {
            const response = await putActividadbyidModel(safedata);
            res.json({message:`La actividad ha sido actualizada con exito`,response})
        } catch (error) {
            res.status(500).json({message:`Hubo un problema al actualizar la actividad`})
        }
    }   

    static deleteActividadByidController =async(req,res)=>{
        const {id}= req.params;
        try {
            await deleteActividadByidModel(id);
            res.json({message:`Actividad eliminada correctamente`})
        } catch (error) {
            res.status(500).json({message:`Hubo un problema al eliminar la actividad`,error})
        }
    }
}

export class ActivitiesInscripcionesController {
    static registeStudentinActivity = async (req, res) => {
    
        const {id,activityid} = req.params

       try{
           const response = await registerStudentModel(id,activityid)
           res.json({message:`El estudiante ha sido registrado en la actividad con exito`})
       } catch (error) {
           res.status(500).json({message:'Hubo un problema al registrar al estudiante', error})
       }
    }

    static unsubscribeStudentinActivity = async (req,res) => {

        const {activityid, id} = req.params;

        try{

         const result = await unsubscribeStudentModel(id, activityid);
         
        if (result.affectedRows === 0){
            return res.status(404).json({message: 'No se encontró el registro de inscripción para el estudiante en esta actividad'});
        }

        res.json({message:`El estudiante ha sido desuscrito de la actividad con exito`});
        } catch (error) {
            res.status(500).json({message:'Hubo un problema al desuscribir al estudiante', error})
        }
    }

    static closeInscriptions = async (req,res) => {
        const {id} = req.params;

        try{

        const response = await closeInscriptionsModel(id);

        if (response.affectedRows === 0) {
            return res.status(404).json({ message: 'No se encontró la actividad para cerrar inscripciones' });
        }

        res.json({ message: 'Las inscripciones han sido cerradas con éxito' });

        } catch (error) {
            res.status(500).json({message:'Hubo un problema al cerrar las inscripciones', error})
        }
    }

    static closeActivity = async (req, res) => {

        const {id} = req.params;

        try {

            const response = await closeActivityModel(id);

            if (response.affectedRows === 0) {
                return res.status(404).json({ message: 'No se encontró la actividad para cerrar' });
            }

            res.json({ message: 'La actividad ha sido cerrada con éxito' });

        }
        catch (error) {
            res.status(500).json({message:'Hubo un problema al cerrar la actividad', error})
        }

    }
}


export class ActivitiesAttendanceController {
    static createAttendance = async (req, res) => {
        const data = req.body
        const {registerid} = req.params

        const {success,error,data:safedata} = await validateAttendance(data);
        if(!success){
            return res.status(400).json({message:'Hubo un error al validar la data',error});
        }

        safedata.registro_id = registerid;

        try {
            const response = await registerAttendanceModel(safedata,);

            res.json({message:'Asistencia registrada con éxito'});

        } catch (error) {
            res.status(500).json({message:'Hubo un problema al crear la asistencia', error});
        }
    }
}

export class ActivitiesFilesController {
    static getActivitiesFilesController =async(req,res)=>{
        const {id} = req.params;
        try {
            const response = await getActivitiesFilesModel(id)
            res.json(response);
        } catch (error) {
            res.status(500).json({message:`hubo un error al obtener el archivo`,error})
        }
    }

    static postActivitiesFilesController =async(req,res)=>{
        const data = req.body
        const {id} = req.params;
        data.actividad_id=id
        const {success,error,data:safedata} = await validateFile(data);
                
        if(!success){
            return res.status(404).json({message:'hubo un error al validar la data',error});
        };

        //TODO:Implementar el metodo para subir el archivo a la nube y obtener la url

        const url=''
        safedata.id=uuidv4();
        safedata.url=url;
        try {
            await postActivitiesFilesModel(safedata);
            res.json({message:'Se añadio el archivo con exito'})
        } catch (error) {
            res.status(500).json({message:'hubo un error al añadir el archivo',error})
        }
    }
}