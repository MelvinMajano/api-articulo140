import {Router} from "express"
import AuthController from "../controllers/auth.controller.js"
import {verifyToken} from "../middlewares/auth.middleware.js"
import { isAdmin } from "../middlewares/isAdmin.middleware.js"


const AuthRouter = Router()


/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               // Define aquí los campos requeridos para el registro
 *     responses:
 *       201:
 *         description: Usuario registrado
 *       400:
 *         description: Datos inválidos
 */
AuthRouter.post("/register",AuthController.RegisterUser)

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               // Define aquí los campos requeridos para login
 *     responses:
 *       200:
 *         description: Sesión iniciada
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: Credenciales incorrectas
 */
AuthRouter.post("/login",AuthController.LoginUser)

/**
 * @swagger
 * /api/auth/password/{id}:
 *   put:
 *     summary: Actualizar contraseña de usuario
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Auth
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
 *               // Define aquí los campos requeridos para actualizar contraseña
 *     responses:
 *       200:
 *         description: Contraseña actualizada
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 */
AuthRouter.put("/password/:id",verifyToken,AuthController.UpdatePassword)

/**
 * @swagger
 * /api/auth/data/{id}:
 *   put:
 *     summary: Actualizar datos de usuario
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Auth
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
 *               // Define aquí los campos requeridos para actualizar datos
 *     responses:
 *       200:
 *         description: Datos actualizados
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 */
AuthRouter.put("/data/:id",verifyToken,AuthController.UpdateData)

/**
 * @swagger
 * /api/auth/delete/{id}:
 *   delete:
 *     summary: Eliminar usuario
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Auth
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario eliminado
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 */
AuthRouter.delete("/delete/:id",verifyToken,isAdmin,AuthController.DeleteUser)

export default AuthRouter