import { Router } from "express";
import { verifyToken } from "../../middlewares/auth.middleware.js";
import { isSupervisor } from "../../middlewares/isSupervisor.middleware.js";
import { isAdmin } from "../../middlewares/isAdmin.middleware.js";
import { ActivitiesAttendanceController } from "../../controllers/ActivitiesController/activitiesAttendance.controller.js";

const activitiesAttendanceRouter = Router();


/**
 * @swagger
 * /api/activities/attendance:
 *   post:
 *     summary: Registrar asistencia a una actividad
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Attendance
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               // Define aquí los campos requeridos para registrar asistencia
 *     responses:
 *       201:
 *         description: Asistencia registrada
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 */
activitiesAttendanceRouter.post('/',verifyToken,isSupervisor,ActivitiesAttendanceController.createAttendance);

/**
 * @swagger
 * /api/activities/attendance/{activityid}:
 *   get:
 *     summary: Ver asistencia de una actividad por ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Attendance
 *     parameters:
 *       - in: path
 *         name: activityid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la actividad
 *     responses:
 *       200:
 *         description: Asistencia de la actividad
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Actividad no encontrada
 */
activitiesAttendanceRouter.get('/:activityid',verifyToken,isAdmin,ActivitiesAttendanceController.viewAttendancebyId);

export default activitiesAttendanceRouter; 

