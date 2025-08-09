import { Router } from "express";
import {ActivitiesAttendanceController, ActivitiesController,ActivitiesDegreesController,ActivitiesFilesController,ActivitiesInscriptionsController} from "../controllers/activities.controllers.js";

const activitiesRouter = Router();

//logica de carreras
activitiesRouter.get('/degrees', ActivitiesDegreesController.getDegrees);
activitiesRouter.post('/degrees', ActivitiesDegreesController.createDegree);
activitiesRouter.put('/degrees/:id', ActivitiesDegreesController.updateDegree);
activitiesRouter.delete('/degrees/:id', ActivitiesDegreesController.deleteDegree);

//Actividades
activitiesRouter.get('/',ActivitiesController.getActividadController);
activitiesRouter.get('/:id',ActivitiesController.getActividadbyIdController);
activitiesRouter.post('/',ActivitiesController.crearActividadController);
activitiesRouter.put('/:id',ActivitiesController.putActividadbyidController);
activitiesRouter.delete('/:id',ActivitiesController.deleteActividadByidController);

//logica de asistencia
activitiesRouter.post('/:registerid/attendance',ActivitiesAttendanceController.createAttendance);
activitiesRouter.get('/:activityid/attendance', ActivitiesAttendanceController.viewAttendancebyId)
activitiesRouter.put('/:activityid/attendance/:userid', ActivitiesAttendanceController.updateUserAttendance);

//Logica de inscripciones
activitiesRouter.post('/:activityid/register/:id', ActivitiesInscriptionsController.registeStudentinActivity)
activitiesRouter.delete('/:activityid/unsubscribe/:id', ActivitiesInscriptionsController.unsubscribeStudentinActivity);
activitiesRouter.put('/register/end/:id', ActivitiesInscriptionsController.closeInscriptions)
activitiesRouter.put('/finish/:id', ActivitiesInscriptionsController.closeActivity);

//logica de archivos
activitiesRouter.post('/:id/files',ActivitiesFilesController.postActivitiesFilesController);
activitiesRouter.get('/:id/files',ActivitiesFilesController.getActivitiesFilesController);

export default activitiesRouter;   