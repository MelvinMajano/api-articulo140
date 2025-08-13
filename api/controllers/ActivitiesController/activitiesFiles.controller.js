import { getActivitiesFilesModel, postActivitiesFilesModel } from "../../models/activitiesModel/activitiesFile.model.js";
import { validateFile } from "../../schemas/ActivitiesSchema/activitiesFileShema.js";
import { v4 as uuidv4 } from "uuid";
import { successResponse, erroResponse } from "../../utils/responseHandler.js";

export class ActivitiesFilesController {
    static getActivitiesFilesController =async(req,res)=>{
        const {id} = req.params;
        try {
            const response = await getActivitiesFilesModel(id)
            return successResponse(res,200,response)
        } catch (error) {
            return erroResponse(res,500,'hubo un error al obtener el archivo',error)
        }
    }

    static postActivitiesFilesController =async(req,res)=>{
        const data = req.body
        const {id} = req.params;
        data.actividad_id=id
        const {success,error,data:safedata} = await validateFile(data);
                
        if(!success){
            return erroResponse(res,404,'hubo un error al validar la data',error);
        };

        //TODO:Implementar el metodo para subir el archivo a la nube y obtener la url

        const url=''
        safedata.id=uuidv4();
        safedata.url=url;
        try {
            await postActivitiesFilesModel(safedata);
            return successResponse(res, 200, 'Se añadio el archivo con exito');
        } catch (error) {
            return erroResponse(res, 500, 'hubo un error al añadir el archivo', error);
        }
    }
}