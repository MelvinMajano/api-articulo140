import { Router } from "express";
import {ActivitiesAttendanceController, ActivitiesController,ActivitiesFilesController,ActivitiesInscripcionesController} from "../controllers/activities.controllers.js";


const activitiesRouter = Router();

activitiesRouter.get('/',ActivitiesController.getActividadController);

activitiesRouter.get('/:id',ActivitiesController.getActividadbyIdController);

activitiesRouter.post('/',ActivitiesController.crearActividadController);

activitiesRouter.put('/:id',ActivitiesController.putActividadbyidController);

activitiesRouter.delete('/:id',ActivitiesController.deleteActividadByidController);

//logica de asistencia
activitiesRouter.post('/:registerid/attendance',ActivitiesAttendanceController.createAttendance);

//Logica de inscripciones
activitiesRouter.post('/:activityid/register/:id', ActivitiesInscripcionesController.registeStudentinActivity)
activitiesRouter.delete('/:activityid/unsubscribe/:id', ActivitiesInscripcionesController.unsubscribeStudentinActivity);
activitiesRouter.put('/register/end/:id', ActivitiesInscripcionesController.closeInscriptions)
activitiesRouter.put('/finish/:id', ActivitiesInscripcionesController.closeActivity);

//logica de archivos
activitiesRouter.post('/:id/files',ActivitiesFilesController.postActivitiesFilesController);

export default activitiesRouter;  