import { crearActividadModel, getActividadbyIdModel, getActividadModel, putActividadbyidModel } from "../models/activities.model.js"
import { validateActividad } from "../schemas/activitiesSchema.js"
import { v4 as uuidv4 } from "uuid";

class ActitiesController {
    static getActividadController =async(req,res)=>{
        try {
            const response = await getActividadModel();
            res.json(response)
        } catch (error) {
            res.status(404).json({message:'Hubo un error al obtener la data', error})
        }
    }

    static getActividadbyIdController = async(req,res)=>{
        const {id} = req.params;
        try {
            const response =  await getActividadbyIdModel(id);

            res.json(response);
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
        try {
            const response = await putActividadbyidModel(id,data);
            res.json({message:`La actividad ha sido actualizada con exito`})
        } catch (error) {
            res.status(404).json({message:`Hubo un problema al actualizar la actividad`})
        }
    }   

    static deleteActividadByidController =(req,res)=>{
        res.json({message:'Actividad eliminada'})
    }
}

export default ActitiesController;