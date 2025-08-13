import { Router } from "express";
import UserController from "../controllers/users.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const UserRouter= Router()

UserRouter.get("/:id/activities",verifyToken,UserController.GetUserActivity)
UserRouter.get("/:id/fields",verifyToken,UserController.ActivitiesScope)
UserRouter.post("/:id/registerActivity",  UserController.registerActivityForStudent);


export default UserRouter