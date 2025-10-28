import { Router } from "express";
import { verifyToken } from "../../middlewares/auth.middleware.js";
import { isSupervisor } from "../../middlewares/isSupervisor.middleware.js";
import { isAdmin } from "../../middlewares/isAdmin.middleware.js";
import { ActivitiesController } from "../../controllers/ActivitiesController/activities.controller.js";

const mainActivitiesRouter = Router();

mainActivitiesRouter.get('/', verifyToken,ActivitiesController.getActivityController);

mainActivitiesRouter.get('/deletedActivities',verifyToken,isAdmin, ActivitiesController.getDeletedActivitiesController);

mainActivitiesRouter.get('/:id',verifyToken,ActivitiesController.getActivityByIdController);

mainActivitiesRouter.get('/supervisor/:id',verifyToken,isSupervisor,ActivitiesController.getActivitiesForSupervisorId);

mainActivitiesRouter.post('/', verifyToken,isAdmin,ActivitiesController.createActivityController);

mainActivitiesRouter.put('/:id', verifyToken,isAdmin,ActivitiesController.putActivityByIdController);

mainActivitiesRouter.put('/disableEneable/:id', verifyToken,isAdmin,ActivitiesController.putActivityDisableEneable);
mainActivitiesRouter.get('/disableEneable/:id',verifyToken,isAdmin,ActivitiesController.getActivityDisableEneable);

mainActivitiesRouter.delete('/:id',verifyToken,isAdmin,ActivitiesController.deleteActivityByIdController);

export default mainActivitiesRouter;
