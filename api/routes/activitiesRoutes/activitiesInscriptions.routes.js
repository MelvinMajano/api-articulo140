import { Router } from "express";
import { verifyToken } from "../../middlewares/auth.middleware.js";
import { isStudent } from "../../middlewares/isStudent.middleware.js";
import { ActivitiesInscriptionsController } from "../../controllers/ActivitiesController/activitiesInscriptions.controller.js";
import { isSupervisor } from "../../middlewares/isSupervisor.middleware.js";
import { isAdmin } from "../../middlewares/isAdmin.middleware.js";

const activitiesInscriptionsRouter = Router();

activitiesInscriptionsRouter.post('/:activityid/register/:id' ,verifyToken,isStudent,ActivitiesInscriptionsController.registeStudentinActivity)

activitiesInscriptionsRouter.get('/:activityid/register' ,verifyToken,isSupervisor,ActivitiesInscriptionsController.getStudentsbyActivityID)

activitiesInscriptionsRouter.put('/register/end/:id',verifyToken,isSupervisor,ActivitiesInscriptionsController.closeInscriptions)

activitiesInscriptionsRouter.put('/finish/:id',verifyToken,isSupervisor,ActivitiesInscriptionsController.closeActivity);

export default activitiesInscriptionsRouter;
