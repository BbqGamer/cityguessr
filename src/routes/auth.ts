import { Router } from "express";
import { auth, register } from "../services/auth";
import { activate } from "../services/activation";
import { forgotPassword, sendForgotPasswordEmail, resetPasswordPage, resetPassword } from "../services/forgot";

export var authRouter = Router();

authRouter.get('/login', function (req, res) {
    res.render('login', { user: req.session.user, error: '' });
})

authRouter.get('/register', function (req, res) {
    res.render('register', { user: req.session.user, error: '' });
})

authRouter.get('/logout', function (req, res) {
    if (req.session.user) {
        req.session.destroy((err) => {
            if (err) {
                res.status(500).render('status/500', { user: req.session.user, error: err });
            }
        });
    }
    res.redirect('/');
})

authRouter.post('/login/password', auth)
authRouter.post('/register', register)
authRouter.get('/activate/:token', activate)
authRouter.get('/forgot', forgotPassword)
authRouter.post('/forgot', sendForgotPasswordEmail)
authRouter.get('/reset/:token', resetPasswordPage)
authRouter.post('/reset/:token', resetPassword)



