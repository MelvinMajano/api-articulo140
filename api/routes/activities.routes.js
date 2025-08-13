import { Router } from "express";
import { ActivitiesController } from "../controllers/ActivitiesController/activities.controller.js";
import { ActivitiesInscriptionsController } from "../controllers/ActivitiesController/activitiesInscriptions.controller.js";
import { ActivitiesDegreesController } from "../controllers/ActivitiesController/activitiesDegrees.controller.js";
import { ActivitiesAttendanceController } from "../controllers/ActivitiesController/activitiesAttendance.controller.js";
import { ActivitiesFilesController } from "../controllers/ActivitiesController/activitiesFiles.controller.js";

const activitiesRouter = Router();

//logica de carreras
activitiesRouter.get('/degrees', ActivitiesDegreesController.getDegrees);
activitiesRouter.post('/degrees', ActivitiesDegreesController.createDegree);
activitiesRouter.put('/degrees/:id', ActivitiesDegreesController.updateDegree);
activitiesRouter.delete('/degrees/:id', ActivitiesDegreesController.deleteDegree);

//Actividades
activitiesRouter.get('/',ActivitiesController.getActivityController);
activitiesRouter.get('/:id',ActivitiesController.getActivityByIdController);
activitiesRouter.post('/',ActivitiesController.createActivityController);
activitiesRouter.put('/:id',ActivitiesController.putActivityByIdController);
activitiesRouter.delete('/:id',ActivitiesController.deleteActivityByIdController);

//logica de asistencia
activitiesRouter.post('/attendance',ActivitiesAttendanceController.createAttendance);
activitiesRouter.get('/:activityid/attendance', ActivitiesAttendanceController.viewAttendancebyId);

//Logica de inscripciones
activitiesRouter.post('/:activityid/register/:id', ActivitiesInscriptionsController.registeStudentinActivity)
activitiesRouter.put('/register/end/:id', ActivitiesInscriptionsController.closeInscriptions)
activitiesRouter.put('/finish/:id', ActivitiesInscriptionsController.closeActivity);

//logica de archivos
activitiesRouter.post('/:id/files',ActivitiesFilesController.postActivitiesFilesController);
activitiesRouter.get('/:id/files',ActivitiesFilesController.getActivitiesFilesController);

export default activitiesRouter;   