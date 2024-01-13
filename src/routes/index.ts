import { cityRouter } from '../controllers/CityController';
import { userRouter } from '../controllers/UserController';
import { Router } from 'express';

export const indexRouter = Router();

indexRouter.use('/cities', cityRouter);
indexRouter.use('/users', userRouter);

indexRouter.get('/', (req, res) => {
    res.render('index');
});
