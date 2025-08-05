import {Router} from "express"
import AuthController from "../controllers/auth.controller.js"
import verifyToken from "../middlewares/auth.middlewares.js"


const AuthRouter = Router()

  
AuthRouter.post("/register",AuthController.RegisterUser)
AuthRouter.post("/login",AuthController.LoginUser)
AuthRouter.put("/password/:id",verifyToken,AuthController.UpdatePassword)

export default AuthRouter