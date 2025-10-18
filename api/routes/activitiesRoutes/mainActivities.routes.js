import { Router } from "express";
import { verifyToken } from "../../middlewares/auth.middleware.js";
import { isSupervisor } from "../../middlewares/isSupervisor.middleware.js";
import { isAdmin } from "../../middlewares/isAdmin.middleware.js";
import { ActivitiesController } from "../../controllers/ActivitiesController/activities.controller.js";


const mainActivitiesRouter = Router();


/**
 * @swagger
 * /api/activities:
 *   get:
 *     summary: Obtiene todas las actividades
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Activities
 *     responses:
 *       200:
 *         description: Lista de actividades
 *       401:
 *         description: No autorizado
 */
mainActivitiesRouter.get('/', verifyToken,ActivitiesController.getActivityController);





/**
 * @swagger
 * /api/activities/{id}:
 *   get:
 *     summary: Obtiene una actividad por ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Activities
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la actividad
 *     responses:
 *       200:
 *         description: Detalle de la actividad
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Actividad no encontrada
 */
mainActivitiesRouter.get('/:id',verifyToken,ActivitiesController.getActivityByIdController);

/**
 * @swagger
 * /api/activities/supervisor/{id}:
 *   get:
 *     summary: Obtiene actividades por ID de supervisor
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Activities
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del supervisor
 *     responses:
 *       200:
 *         description: Lista de actividades del supervisor
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Supervisor no encontrado
 */
mainActivitiesRouter.get('/supervisor/:id',verifyToken,isSupervisor,ActivitiesController.getActivitiesForSupervisorId);

/**
 * @swagger
 * /api/activities:
 *   post:
 *     summary: Crea una nueva actividad
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Activities
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               // Define aquí los campos requeridos para crear una actividad
 *     responses:
 *       201:
 *         description: Actividad creada
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 */
mainActivitiesRouter.post('/', verifyToken,isAdmin,ActivitiesController.createActivityController);



/**
 * @swagger
 * /api/activities/{id}:
 *   put:
 *     summary: Actualiza una actividad por ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Activities
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la actividad
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
 *         description: Actividad actualizada
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Actividad no encontrada
 */
mainActivitiesRouter.put('/:id', verifyToken,isAdmin,ActivitiesController.putActivityByIdController);




mainActivitiesRouter.put('/disableEneable/:id', verifyToken,isAdmin,ActivitiesController.putActivityDisableEneable);
mainActivitiesRouter.get('/disableEneable/:id',verifyToken,isAdmin,ActivitiesController.getActivityDisableEneable);
/**
 * @swagger
 * /api/activities/{id}:
 *   delete:
 *     summary: Elimina una actividad por ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Activities
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la actividad
 *     responses:
 *       200:
 *         description: Actividad eliminada 
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Actividad no encontrada
 */
mainActivitiesRouter.delete('/:id',verifyToken,isAdmin,ActivitiesController.deleteActivityByIdController);

export default mainActivitiesRouter;