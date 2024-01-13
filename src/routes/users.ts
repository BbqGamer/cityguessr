import { Router } from "express";
import { UserController } from "../controllers/UserController";

export const userRouter = Router();
userRouter.get('/', UserController.getAll);
userRouter.get('/profile', UserController.getProfile);
