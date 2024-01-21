import { CityController, cityRouter } from '../controllers/CityController';
import { userRouter } from './users';
import { Router } from 'express';
import { authRouter } from './auth';

export const indexRouter = Router();

indexRouter.use('/cities', cityRouter);

indexRouter.use('/users', userRouter);
indexRouter.use('/auth', authRouter);

indexRouter.get('/', CityController.getAll);

indexRouter.get('/game', (req, res) => {
    res.render('game', { user: req.session.user });
})