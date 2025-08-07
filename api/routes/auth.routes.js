import {Router} from "express"
import AuthController from "../controllers/auth.controller.js"
import {verifyToken} from "../middlewares/auth.middlewares.js"


const AuthRouter = Router()


  
AuthRouter.post("/register",AuthController.RegisterUser)
AuthRouter.post("/login",AuthController.LoginUser)
AuthRouter.put("/password/:id",verifyToken,AuthController.UpdatePassword)
AuthRouter.put("/data/:id",verifyToken,AuthController.UpdateData)





export default AuthRouter