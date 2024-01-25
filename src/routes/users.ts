import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { gameSettings } from "../app";

export const userRouter = Router();
userRouter.get('/', UserController.getAll);
userRouter.get('/profile', UserController.getProfile);

userRouter.get('/change_settings', (req, res) => {
    if (!req.session.user) {
        res.redirect('/auth/login');
        return;
    }

    if (req.session.user.privilege < 1) {
        res.status(401).render('status/401', { user: req.session.user, error: 'Unauthorized' });
        return;
    }
    // take from query params
    console.log(req.query);
    const countdown = req.query.countdown;
    const cityQuery = req.query.cityQuery;
    const cityQuerySize = req.query.cityQuerySize;
    gameSettings.countdown = Number(countdown);
    gameSettings.cityQuery = String(cityQuery);
    gameSettings.cityQuerySize = Number(cityQuerySize);
    res.redirect('/users/profile');
})
