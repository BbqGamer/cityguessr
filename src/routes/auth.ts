import { Router } from "express";
import { passport } from '../services/auth'

export var authRouter = Router();

authRouter.get('/login', function (req, res) {
    res.render('login');
})

authRouter.post('/login/password', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
}));
