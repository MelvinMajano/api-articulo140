import { crearActividadModel } from "../models/activities.model.js"
import { validateActividad } from "../schemas/activitiesSchema.js"
import { v4 as uuidv4 } from "uuid";

class ActitiesController {
    static getActividadController =(req,res)=>{
        res.json({message:'Todas los Actividads'})
    }

    static getActividadbyIdController =(req,res)=>{
        res.json({message:'Actividad por id'})
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

    static putActividadbyidController =(req,res)=>{
        res.json({message:'Actividad actualizada'})
    }   

    static deleteActividadByidController =(req,res)=>{
        res.json({message:'Actividad eliminada'})
    }
}

export default ActitiesController;