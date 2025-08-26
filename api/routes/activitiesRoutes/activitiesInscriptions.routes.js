import { Router } from "express";
import { verifyToken } from "../../middlewares/auth.middleware.js";
import { isStudent } from "../../middlewares/isStudent.middleware.js";
import { ActivitiesInscriptionsController } from "../../controllers/ActivitiesController/activitiesInscriptions.controller.js";
import { isSupervisor } from "../../middlewares/isSupervisor.middleware.js";

const activitiesInscriptionsRouter = Router();


/**
 * @swagger
 * /api/activities/{activityid}/register/{id}:
 *   post:
 *     summary: Inscribir estudiante en una actividad
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Inscriptions
 *     parameters:
 *       - in: path
 *         name: activityid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la actividad
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del estudiante
 *     responses:
 *       201:
 *         description: Estudiante inscrito
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 */
activitiesInscriptionsRouter.post('/:activityid/register/:id',verifyToken,isStudent,ActivitiesInscriptionsController.registeStudentinActivity)

/**
 * @swagger
 * /api/activities/register/end/{id}:
 *   put:
 *     summary: Cerrar inscripciones de una actividad
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Inscriptions
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la actividad
 *     responses:
 *       200:
 *         description: Inscripciones cerradas
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Actividad no encontrada
 */
activitiesInscriptionsRouter.put('/register/end/:id',verifyToken,ActivitiesInscriptionsController.closeInscriptions)

/**
 * @swagger
 * /api/activities/finish/{id}:
 *   put:
 *     summary: Finalizar una actividad
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Inscriptions
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la actividad
 *     responses:
 *       200:
 *         description: Actividad finalizada
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Actividad no encontrada
 */
activitiesInscriptionsRouter.put('/finish/:id',verifyToken,isSupervisor,ActivitiesInscriptionsController.closeActivity);

export default activitiesInscriptionsRouter;
