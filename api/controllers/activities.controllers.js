import { getActividadbyIdModel, getActividadModel, ValidateCreateActivitiesModel, ValidateDeleteActivitiesModel, ValitateUpdateActivitiesModel
} from "../models/activitiesModel/activities.model.js"
import { registerAttendanceModel, getAttendanceModel, updateAttendanceModel} from "../models/activitiesModel/activitiesAttendance.model.js";
import { getActivitiesFilesModel, postActivitiesFilesModel } from "../models/activitiesModel/activitiesFile.model.js";
import { validateFile } from "../schemas/ActivitiesSchema/activitiesFileShema.js";
import { validateAttendance } from "../schemas/ActivitiesSchema/activitiesAttendanceSchema.js";
import { validateActividad, validateActividadput } from "../schemas/ActivitiesSchema/activitiesSchema.js"
import { validateDegree } from "../schemas/ActivitiesSchema/activitiesDegreesSchema.js";
import { studentExists,activityExists,registerStudentModel, unsubscribeStudentModel, closeInscriptionsModel, closeActivityModel } from "../models/activitiesModel/activitiesInscriptions.model.js";
import { degreeExistsModel,hasConflictDegreeModel, createDegreeModel, updateDegreeModel, deleteDegreeModel, getDegreesModel } from "../models/activitiesModel/activitiesDegrees.model.js";
import { v4 as uuidv4 } from "uuid";
import { calculateAllStudentsVOAE } from "../utils/activities/horasVOAECalculator.js";



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
        data.degreeId = 1

        try {
            await ValidateCreateActivitiesModel.crearActividadModel(data);
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
            const result = await ValitateUpdateActivitiesModel.validateActivitiesDelete(id);
                if(result==='true'){
                    return res.status(400).json({message:`No se puede actualizar una actividad eliminada`});
                }

            const response = await ValitateUpdateActivitiesModel.putActividadbyidModel(safedata);
            res.json({message:`La actividad ha sido actualizada con exito`,response})
        } catch (error) {
            res.status(500).json({message:`Hubo un problema al actualizar la actividad`, error})
        }
    }   

    static deleteActividadByidController =async(req,res)=>{
        const {id}= req.params;
        try {
            const {inscripcion,status,isDeleted} = await ValidateDeleteActivitiesModel.validateActivitiesModel(id);

            if(inscripcion){
                return res.status(400).json({message:`La actividad no se puede eliminar por que tiene estudiantes inscritos`})
            }

            
          if(isDeleted==='true'){
                return res.status(400).json({message:`La actividad ya esta eliminada`})
            }
            
            if(!status){
                return res.status(400).json({message:`Actividad no encontrada`})
            }

            if(status==='inProgress'){
                return res.json({message:`Actividad en proceso no puede ser eliminada `});
            }else if(status==='finished'){
                return res.json({message:`Actividad finalizada no puede ser eliminada`});
            }
            
            await ValidateDeleteActivitiesModel.deleteActivitiesModel(id);
            return res.json({message:`Actividad eliminada exitosamente`});
        } catch (error) {
            res.status(500).json({message:`Hubo un problema al eliminar la actividad`,error})
        }
    }

}

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

            await closeActivityModel(id);
            res.json({ message: 'La actividad ha sido cerrada con éxito' });

            // TODO: Implementar la logica para que esta funcion funcione(valga la redundancia)
            // await calculateAllStudentsVOAE(id);


        }
        catch (error) {
            res.status(500).json({message:'Hubo un problema al cerrar la actividad', error}) 
        }

    }
}

export class ActivitiesDegreesController {

    static createDegree = async (req, res) => {

        const degree = req.body;

        const { success, error } = await validateDegree(degree);

        if (!success) {
            return res.status(400).json({ 
                message: "Error al validar los datos",
                errors: error.format(),   
            });
        }

        try {
            await createDegreeModel(degree);
            res.status(201).json({ message: "Carrera creada con éxito" });
        } catch (error) {
            res.status(500).json({ message: "Hubo un problema al crear la carrera", error });
        }
    }

    static getDegrees = async (req, res) => {
        try {
            const degrees = await getDegreesModel();
            res.json(degrees);
        } catch (error) {
            res.status(500).json({ message: "Hubo un problema al obtener las carreras", error });
        }
    }

    static updateDegree = async (req, res) => {
        const { id } = req.params;
        const degree = req.body;

        const { success, error } = await validateDegree(degree);

        if (!success) {
            return res.status(400).json({ 
                message: "Error al validar los datos",
                errors: error.format(),   
            });
        }

        const degreeExist = await degreeExistsModel(id);

        if (degreeExist.length === 0) {
            return res.status(404).json({ message: "Carrera no encontrada" });
        }

        try {
            await updateDegreeModel(degree, id);
            res.json({ message: "Carrera actualizada con éxito" });
        } catch (error) {
            res.status(500).json({ message: "Hubo un problema al actualizar la carrera", error });
        }
    }

    static deleteDegree = async (req, res) => {
        const { id } = req.params;

        const degreeExist = await degreeExistsModel(id);
        const hasConflict = await hasConflictDegreeModel(id);

        if (degreeExist.length === 0) {
            return res.status(404).json({ message: "Carrera no encontrada" });
        }

        if (hasConflict.length > 0) {
            return res.status(409).json({ message: "La carrera no se puede eliminar porque está vinculada a una actividad" });
        }

        try {
            await deleteDegreeModel(id);
            res.json({ message: "Carrera eliminada con éxito" });
        } catch (error) {
            res.status(409).json({ message: "Hubo un problema al eliminar la carrera", error: error.message });
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
