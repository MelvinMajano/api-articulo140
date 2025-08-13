import { Router } from "express";
import UserController from "../controllers/users.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";

const UserRouter= Router()

UserRouter.get("/:id/activities",verifyToken,isAdmin,UserController.GetUserActivity)
UserRouter.get("/:id/fields",verifyToken,isAdmin,UserController.ActivitiesScope)
UserRouter.post("/:id/registerActivity", verifyToken,isAdmin, UserController.registerActivityForStudent);


export default UserRouter