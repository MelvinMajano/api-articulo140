import { getActividadbyIdModel, getActividadModel, ValidateCreateActivitiesModel, ValitateUpdateActivitiesModel, ValidateDeleteActivitiesModel } from "../../models/activitiesModel/activities.model.js";
import { validateActividad, validateActividadput } from "../../schemas/ActivitiesSchema/activitiesSchema.js";
import { v4 as uuidv4 } from "uuid";

export class ActivitiesController {
    static getActivityController =async(req,res)=>{
        
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

    static getActivityByIdController = async(req,res)=>{

        const {id} = req.params;
        try {
            const actividad =  await getActividadbyIdModel(id);

            if (actividad.length === 0) {
                return res.status(404).json({message: 'Actividad no encontrada'});
            }

            res.status(200).json(actividad);
        } catch (error) {
            res.status(500).json({message:'Hubo un problema al obtener la actividad '},error)
        }
    }

    static createActivityController =async(req,res)=>{

        const activityReceived = req.body;
        const {success,error,data} =await validateActividad(activityReceived);

        if(!success){
            return res.status(404).json({message:`Error al validar la data: ${error}`})
        }

        data.id = uuidv4()
        data.degreeId = 1

        try {
            const response = await ValidateCreateActivitiesModel.validateActivitiesModel(data);
            console.log(response);
            if(response){
                return res.status(404).json({message:`No se puede crear una actividad en este dia ya que ya existe otra actividad en el mismo horario`});
            }
            await ValidateCreateActivitiesModel.crearActividadModel(data);
            res.status(201).json({message:`Actividad creada con exito`});
        } catch (error) {
            res.status(400).json({message:`hubo un error al crear la data`,error})
        }
    }

    static putActivityByIdController = async(req,res)=>{
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

    static deleteActivityByIdController =async(req,res)=>{
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