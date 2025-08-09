import { Router } from "express";
import UserController from "../controllers/users.controller.js";
import { verifyToken } from "../middlewares/auth.middlewares.js";

const UserRouter= Router()

UserRouter.get("/:id/activities",verifyToken,UserController.GetUserActivity)
UserRouter.get("/:id/fields",verifyToken,UserController.ActivitiesScope)


export default UserRouter