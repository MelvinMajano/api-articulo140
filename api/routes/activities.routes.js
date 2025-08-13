import { Router } from "express";
import { ActivitiesController } from "../controllers/ActivitiesController/activities.controller.js";
import { ActivitiesInscriptionsController } from "../controllers/ActivitiesController/activitiesInscriptions.controller.js";
import { ActivitiesDegreesController } from "../controllers/ActivitiesController/activitiesDegrees.controller.js";
import { ActivitiesAttendanceController } from "../controllers/ActivitiesController/activitiesAttendance.controller.js";
import { ActivitiesFilesController } from "../controllers/ActivitiesController/activitiesFiles.controller.js";
import {verifyToken} from "../middlewares/auth.middleware.js"
import { isAdmin } from "../middlewares/isAdmin.middleware.js"
import { isStudent } from "../middlewares/isStudent.middleware.js"
import { isSupervisor } from "../middlewares/isSupervisor.middleware.js"

const activitiesRouter = Router();

//logica de carreras
activitiesRouter.get('/degrees',verifyToken, isAdmin, ActivitiesDegreesController.getDegrees);
activitiesRouter.post('/degrees', verifyToken, isAdmin, ActivitiesDegreesController.createDegree);
activitiesRouter.put('/degrees/:id', verifyToken, isAdmin, ActivitiesDegreesController.updateDegree);
activitiesRouter.delete('/degrees/:id', verifyToken, isAdmin, ActivitiesDegreesController.deleteDegree);

//Actividades
activitiesRouter.get('/',verifyToken,ActivitiesController.getActivityController);
activitiesRouter.get('/:id',verifyToken,ActivitiesController.getActivityByIdController);
activitiesRouter.post('/',verifyToken,isAdmin,ActivitiesController.createActivityController);
activitiesRouter.put('/:id',verifyToken,isAdmin,ActivitiesController.putActivityByIdController);
activitiesRouter.delete('/:id',verifyToken,isAdmin,ActivitiesController.deleteActivityByIdController);

//logica de asistencia
activitiesRouter.post('/attendance',verifyToken,isSupervisor,ActivitiesAttendanceController.createAttendance);
activitiesRouter.get('/:activityid/attendance',verifyToken,isAdmin,ActivitiesAttendanceController.viewAttendancebyId);

//Logica de inscripciones
activitiesRouter.post('/:activityid/register/:id',verifyToken,isStudent,ActivitiesInscriptionsController.registeStudentinActivity)
activitiesRouter.put('/register/end/:id',verifyToken,ActivitiesInscriptionsController.closeInscriptions)
activitiesRouter.put('/finish/:id',verifyToken,isSupervisor,ActivitiesInscriptionsController.closeActivity);

//logica de archivos
activitiesRouter.post('/:id/files',verifyToken,isAdmin,ActivitiesFilesController.postActivitiesFilesController);
activitiesRouter.get('/:id/files',verifyToken,isAdmin,ActivitiesFilesController.getActivitiesFilesController);

export default activitiesRouter;   