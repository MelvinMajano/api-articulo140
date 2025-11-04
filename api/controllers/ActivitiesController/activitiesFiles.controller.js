import { successResponse, erroResponse } from "../../utils/responseHandler.js";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export class ActivitiesFilesController {
    static getFilesController =async(req,res)=>{
         try {
        const allImages = await cloudinary.api.resources({
            resource_type: 'image',
            type: 'upload',
        });

        const filteredImages = allImages.resources.filter(
            image => image.asset_folder === 'ARTICULO140IMAGES'
        );

        return successResponse(res, 200, "Las imágenes son:", filteredImages);
    } catch (error) {
        return erroResponse(res, error.message);
    }
    }

    static postFilesController =async(req,res)=>{
        
        try {

            const file = req.file;
            if (!file) {
                return erroResponse(res, 400, 'No se ha proporcionado ningún archivo');
            }
            const result = await cloudinary.uploader.upload(file.path, {
                folder: 'ARTICULO140IMAGES',
            });

            return successResponse(res, 201, 'Archivo subido con éxito', result);
            
        } catch (error) {
            return erroResponse(res, error.message);
        }
    }

    static deleteFilesController = async (req, res) => {
        const { public_id } = req.body;

        try {
            
            const result = await cloudinary.uploader.destroy(public_id, {
            resource_type: 'image',
            });

            if (result.result !== 'ok') {
              return erroResponse(res, 400, 'No se pudo eliminar el archivo', result);
            }

            return successResponse(res, 200, 'Archivo eliminado con éxito', result);
        } catch (error) {
            return erroResponse(res, error.message);
        }
    }
}