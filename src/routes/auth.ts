import { Router } from "express";
import { auth } from "../services/auth";

export var authRouter = Router();

authRouter.get('/login', function (req, res) {
    res.render('login');
})

authRouter.get('/logout', function (req, res) {
    if (req.session.user) {
        req.session.destroy((err) => {
            if (err) {
                console.log(err);
            }
        });
    }
    res.redirect('/');
})

authRouter.post('/login/password', auth)
