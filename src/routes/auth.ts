import { Router } from "express";
import { resetPassword } from "../services/forgot";
import { AuthController } from "../controllers/AuthController";
import { AccountController } from "../controllers/AccountController";


export var authRouter = Router();

authRouter.get('/login', AuthController.loginPage)
authRouter.post('/login', AuthController.login)

authRouter.get('/register', AuthController.registerPage)
authRouter.post('/register', AuthController.register)

authRouter.get('/logout', AuthController.logout)

authRouter.get('/forgot', AccountController.forgotPasswordPage)
authRouter.post('/forgot', AccountController.forgotPassword)
authRouter.get('/reset/:token', AccountController.resetPasswordPage)
authRouter.post('/reset/:token', AccountController.resetPassword)

authRouter.get('/activate/:token', AccountController.activateAccount)
