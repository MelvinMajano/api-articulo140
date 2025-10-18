import {Router} from 'express';
import { ActivitiesDegreesController } from '../../controllers/ActivitiesController/activitiesDegrees.controller.js';
import { verifyToken } from '../../middlewares/auth.middleware.js';
import { isAdmin } from '../../middlewares/isAdmin.middleware.js';

const activitiesDegreesRouter = Router();

/**
 * @swagger
 * /api/activities/degrees:
 *   get:
 *     summary: Obtiene todas las carreras
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Degrees
 *     responses:
 *       200:
 *         description: Lista de carreras
 *       401:
 *         description: No autorizado
 */
activitiesDegreesRouter.get('/',verifyToken,isAdmin, ActivitiesDegreesController.getDegrees);

/**
 * @swagger
 * /api/activities/degrees:
 *   post:
 *     summary: Crea una nueva carrera
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Degrees
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               // Define aquí los campos requeridos para crear una carrera
 *     responses:
 *       201:
 *         description: Carrera creada
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 */
activitiesDegreesRouter.post('/', verifyToken, isAdmin, ActivitiesDegreesController.createDegree);

/**
 * @swagger
 * /api/activities/degrees/{id}:
 *   put:
 *     summary: Actualiza una carrera por ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Degrees
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la carrera
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               // Define aquí los campos que se pueden actualizar
 *     responses:
 *       200:
 *         description: Carrera actualizada
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Carrera no encontrada
 */
activitiesDegreesRouter.put('/:id',verifyToken,isAdmin, ActivitiesDegreesController.updateDegree);

/**
 * @swagger
 * /api/activities/degrees/{id}:
 *   delete:
 *     summary: Elimina una carrera por ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Degrees
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la carrera
 *     responses:
 *       200:
 *         description: Carrera eliminada
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Carrera no encontrada
 */
activitiesDegreesRouter.delete('/:id',verifyToken,isAdmin, ActivitiesDegreesController.deleteDegree);


export default activitiesDegreesRouter;
