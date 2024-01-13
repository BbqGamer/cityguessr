import { cityRouter } from '../controllers/CityController';
import { userRouter } from './users';
import { apiRouter } from './api/api';
import { Router } from 'express';
import { authRouter } from './auth';

export const indexRouter = Router();

indexRouter.use('/api', apiRouter)
indexRouter.use('/cities', cityRouter);
indexRouter.use('/users', userRouter);
indexRouter.use('/auth', authRouter);

indexRouter.get('/', (req, res) => {
    res.render('index', { user: req.session.user });
});