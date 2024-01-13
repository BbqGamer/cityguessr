import { Router } from "express";
import { cityRouter } from "../../controllers/CityController";
import { userRouter } from "../users";

export const apiRouter = Router();
apiRouter.use('/cities', cityRouter);
apiRouter.use('/users', userRouter);
