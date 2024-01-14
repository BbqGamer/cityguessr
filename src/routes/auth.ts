import { Router } from "express";
import { auth, register } from "../services/auth";
import { activate } from "../services/activation";
import { forgotPassword, sendForgotPasswordEmail, resetPasswordPage, resetPassword } from "../services/forgot";
import { AuthController } from "../controllers/api/AuthController";


export var authRouter = Router();

authRouter.get('/login', AuthController.loginPage)
authRouter.get('/register', AuthController.registerPage)
authRouter.get('/logout', AuthController.logout)

authRouter.post('/login/password', auth)
authRouter.post('/register', register)
authRouter.get('/activate/:token', activate)
authRouter.get('/forgot', forgotPassword)
authRouter.post('/forgot', sendForgotPasswordEmail)
authRouter.get('/reset/:token', resetPasswordPage)
authRouter.post('/reset/:token', resetPassword)
