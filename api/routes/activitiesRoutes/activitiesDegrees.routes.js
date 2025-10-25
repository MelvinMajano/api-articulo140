import {Router} from 'express';
import { ActivitiesDegreesController } from '../../controllers/ActivitiesController/activitiesDegrees.controller.js';
import { verifyToken } from '../../middlewares/auth.middleware.js';
import { isAdmin } from '../../middlewares/isAdmin.middleware.js';

const activitiesDegreesRouter = Router();

activitiesDegreesRouter.get('/',verifyToken,isAdmin, ActivitiesDegreesController.getDegrees);

activitiesDegreesRouter.post('/', verifyToken, isAdmin, ActivitiesDegreesController.createDegree);

activitiesDegreesRouter.put('/:id',verifyToken,isAdmin, ActivitiesDegreesController.updateDegree);

activitiesDegreesRouter.delete('/:id',verifyToken,isAdmin, ActivitiesDegreesController.deleteDegree);

export default activitiesDegreesRouter;
