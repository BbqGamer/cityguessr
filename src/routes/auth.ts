import { Router } from "express";
import { activate } from "../services/activation";
import { sendForgotPasswordEmail, resetPassword } from "../services/forgot";
import { AuthController } from "../controllers/api/AuthController";


export var authRouter = Router();

authRouter.get('/login', AuthController.loginPage)
authRouter.post('/login', AuthController.login)

authRouter.get('/register', AuthController.registerPage)
authRouter.post('/register', AuthController.register)

authRouter.get('/logout', AuthController.logout)

authRouter.get('/forgot', AuthController.forgotPasswordPage)


authRouter.get('/reset/:token', AuthController.resetPasswordPage)

authRouter.get('/activate/:token', activate)
authRouter.post('/forgot', sendForgotPasswordEmail)
authRouter.post('/reset/:token', resetPassword)
