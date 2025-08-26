import { Router } from "express";
import { ActivitiesFilesController } from "../../controllers/ActivitiesController/activitiesFiles.controller.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";
import { isAdmin } from "../../middlewares/isAdmin.middleware.js";

const activitiesFilesRouter = Router();


/**
 * @swagger
 * /api/activities/{id}/files:
 *   post:
 *     summary: Subir archivos a una actividad
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Files
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               // Define aquí los campos requeridos para subir archivos
 *     responses:
 *       201:
 *         description: Archivo subido
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 */
activitiesFilesRouter.post('/:id/files',verifyToken,isAdmin,ActivitiesFilesController.postActivitiesFilesController);

/**
 * @swagger
 * /api/activities/{id}/files:
 *   get:
 *     summary: Obtener archivos de una actividad
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Files
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la actividad
 *     responses:
 *       200:
 *         description: Lista de archivos
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Actividad no encontrada
 */
activitiesFilesRouter.get('/:id/files',verifyToken,isAdmin,ActivitiesFilesController.getActivitiesFilesController);

export default activitiesFilesRouter;