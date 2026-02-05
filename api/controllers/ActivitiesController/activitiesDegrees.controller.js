import { validateDegree } from "../../schemas/ActivitiesSchema/activitiesDegreesSchema.js";
import { createDegreeModel, getDegreesModel, updateDegreeModel, deleteDegreeModel, restoreDegreeModel , degreeExistsModel, hasConflictDegreeModel } from "../../models/activitiesModel/activitiesDegrees.model.js";
import { successResponse, erroResponse } from "../../utils/responseHandler.js";

export class ActivitiesDegreesController {

    static createDegree = async (req, res) => {

        const degree = req.body;

        const { success, error } = await validateDegree(degree);

        if (!success) {
            return erroResponse(res, 400, "Error al validar los datos", error.format());
        }

        try {
            await createDegreeModel(degree);
            return successResponse(res, 201, "Carrera creada con éxito");
        } catch (error) {
            return erroResponse(res, 500, "Hubo un problema al crear la carrera", error);
        }
    }

    static getDegrees = async (req, res) => {
        try {
            const degrees = await getDegreesModel();
            return successResponse(res, 200, "Carreras obtenidas con éxito", degrees);
        } catch (error) {
            return erroResponse(res, 500, "Hubo un problema al obtener las carreras", error);
        }
    }

    static updateDegree = async (req, res) => {
        const { id } = req.params;
        const degree = req.body;

        const { success, error } = await validateDegree(degree);

        if (!success) {
            return erroResponse(res, 400, "Error al validar los datos", error.format());
        }

        const degreeExist = await degreeExistsModel(id);

        if (degreeExist.length === 0) {
            return erroResponse(res, 404, "Carrera no encontrada");
        }

        try {
            await updateDegreeModel(degree, id);
            return successResponse(res, 200, "Carrera actualizada con éxito");
        } catch (error) {
            return erroResponse(res, 500, "Hubo un problema al actualizar la carrera", error);
        }
    }

    static deleteDegree = async (req, res) => {
        const { id } = req.params;

        const degreeExist = await degreeExistsModel(id);
        const hasConflict = await hasConflictDegreeModel(id);

        if (degreeExist.length === 0) {
            return erroResponse(res, 404, "Carrera no encontrada");
        }

        if (hasConflict.length > 0) {
            return erroResponse(res, 409, "La carrera no se puede eliminar porque está vinculada a una actividad");
        }

        try {
            await deleteDegreeModel(id);
            return successResponse(res, 200, "Carrera deshabilitada con éxito");
        } catch (error) {
            return erroResponse(res, 500, "Hubo un problema al deshabilitar la carrera", error);
        }
    }


    static restoreDegree = async (req,res) => {
        const {id} = req.params 

        const degreeExist = await degreeExistsModel(id);

        if (degreeExist.length === 0) {
            return erroResponse(res, 404, "Carrera no encontrada");
        }

        try {
            await restoreDegreeModel(id);
            return successResponse(res, 200, "Carrera restaurada con éxito");
        } catch (error) {
            return erroResponse(res, 500, "Hubo un problema al restaurar la carrera", error);
        }        
    }
}