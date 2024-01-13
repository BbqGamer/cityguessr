import { Router } from "express";
import { auth } from "../services/auth";

export var authRouter = Router();

authRouter.get('/login', function (req, res) {
    res.render('login');
})

authRouter.post('/login/password', auth)
