import { validateDegree } from "../../schemas/ActivitiesSchema/activitiesDegreesSchema.js";
import { createDegreeModel, getDegreesModel, updateDegreeModel, deleteDegreeModel, degreeExistsModel, hasConflictDegreeModel } from "../../models/activitiesModel/activitiesDegrees.model.js";

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