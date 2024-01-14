import { Router } from "express";
import { sendForgotPasswordEmail, resetPassword } from "../services/forgot";
import { AuthController } from "../controllers/AuthController";
import { AccountController } from "../controllers/AccountController";


export var authRouter = Router();

authRouter.get('/login', AuthController.loginPage)
authRouter.post('/login', AuthController.login)

authRouter.get('/register', AuthController.registerPage)
authRouter.post('/register', AuthController.register)

authRouter.get('/logout', AuthController.logout)

authRouter.get('/forgot', AccountController.forgotPasswordPage)
authRouter.post('/forgot', sendForgotPasswordEmail)
authRouter.get('/reset/:token', AccountController.resetPasswordPage)
authRouter.post('/reset/:token', resetPassword)

authRouter.get('/activate/:token', AccountController.activateAccount)
