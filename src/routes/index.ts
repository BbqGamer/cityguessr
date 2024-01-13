import { cityRouter } from '../controllers/CityController';
import { Router } from 'express';

export const indexRouter = Router();

indexRouter.use('/cities', cityRouter);

indexRouter.get('/', (req, res) => {
    res.render('index');
});
