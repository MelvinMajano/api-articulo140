import { Router } from "express";
import UserController from "../controllers/users.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";

const UserRouter= Router()


/**
 * @swagger
 * /api/users/{id}/activities:
 *   get:
 *     summary: Obtener actividades de un usuario
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Lista de actividades del usuario
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 */
UserRouter.get(":id/activities",verifyToken,isAdmin,UserController.GetUserActivity)

/**
 * @swagger
 * /api/users/{id}/fields:
 *   get:
 *     summary: Obtener campos de actividades de un usuario
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Campos de actividades del usuario
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 */
UserRouter.get(":id/fields",verifyToken,isAdmin,UserController.ActivitiesScope)


/** * @swagger
 * /api/users/students:
 *   get:
 *     summary: Obtener lista de estudiantes
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Lista de estudiantes
 *       401:
 *         description: No autorizado
 *       404:
 *         description: No se encontraron estudiantes
 */
UserRouter.get("/students",verifyToken,isAdmin, UserController.getStudents)

/**
 * @swagger
 * /api/users/{id}/registerActivity:
 *   post:
 *     summary: Registrar una actividad para un estudiante
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               // Define aquí los campos requeridos para registrar la actividad
 *     responses:
 *       201:
 *         description: Actividad registrada
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 */
UserRouter.post(":id/registerActivity", verifyToken,isAdmin, UserController.registerActivityForStudent);


export default UserRouter