import { Router } from "express";
import ActitiesController from "../controllers/activities.controllers.js";

const activitiesRouter = Router();

activitiesRouter.get('/',ActitiesController.getActividadController);

activitiesRouter.get('/:id',ActitiesController.getActividadbyIdController);

activitiesRouter.post('/',ActitiesController.crearActividadController);

activitiesRouter.put('/:id',ActitiesController.putActividadbyidController);

activitiesRouter.delete('/:id',ActitiesController.deleteActividadByidController);

export default activitiesRouter;