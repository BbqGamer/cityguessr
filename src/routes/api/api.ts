import { Router } from "express";
import { cityRouter } from "../../controllers/CityController";
import { userRouter } from "../../controllers/UserController";

export const apiRouter = Router();
apiRouter.use('/cities', cityRouter);
apiRouter.use('/users', userRouter);
