import { Router } from "express";

export var authRouter = Router();

authRouter.get('/login', function (req, res) {
    res.render('login');
})
