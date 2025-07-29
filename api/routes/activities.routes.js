import { Router } from "express";
import ActivitiesController from "../controllers/activities.controllers.js";

const activitiesRouter = Router();

activitiesRouter.get('/',ActivitiesController.getActividadController);

activitiesRouter.get('/:id',ActivitiesController.getActividadbyIdController);

activitiesRouter.post('/',ActivitiesController.crearActividadController);

//Logica de inscripciones
activitiesRouter.post('/:activityid/register/:id', ActivitiesController.registeStudentinActivity)

activitiesRouter.put('/:id',ActivitiesController.putActividadbyidController);

activitiesRouter.delete('/:id',ActivitiesController.deleteActividadByidController);

export default activitiesRouter; 