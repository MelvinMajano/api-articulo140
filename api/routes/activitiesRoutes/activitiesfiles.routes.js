import { Router } from "express";
import { ActivitiesFilesController } from "../../controllers/ActivitiesController/activitiesFiles.controller.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";
import { isAdmin } from "../../middlewares/isAdmin.middleware.js";

const activitiesFilesRouter = Router();

activitiesFilesRouter.post('/:id/files',verifyToken,isAdmin,ActivitiesFilesController.postActivitiesFilesController);

activitiesFilesRouter.get('/:id/files',verifyToken,isAdmin,ActivitiesFilesController.getActivitiesFilesController);

export default activitiesFilesRouter;
