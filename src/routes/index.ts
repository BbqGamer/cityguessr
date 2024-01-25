import { CityController, cityRouter } from '../controllers/CityController';
import { userRouter } from './users';
import { Router } from 'express';
import { authRouter } from './auth';
import { gameSettings } from "../app";

export const indexRouter = Router();

indexRouter.use('/cities', cityRouter);
indexRouter.use('/game', (req, res) => {
    if (!req.session.user || !req.session.user.activated) {
        return res.redirect('/auth/login');
    }
    res.render('game', { user: req.session.user });
});

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
    const countdown = req.query.countdown;
    const cityQuery = req.query.cityQuery;
    const cityQuerySize = req.query.cityQuerySize;
    gameSettings.countdown = Number(countdown);
    gameSettings.cityQuery = String(cityQuery);
    gameSettings.cityQuerySize = Number(cityQuerySize);
    res.redirect('/users/profile');
})

indexRouter.use('/users', userRouter);
indexRouter.use('/auth', authRouter);

indexRouter.get('/', CityController.getAll);

indexRouter.get('/game', (req, res) => {
    res.render('game', { user: req.session.user });
})
