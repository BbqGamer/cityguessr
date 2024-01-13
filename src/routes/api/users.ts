import { Router } from "express";
import { UserController } from "../../controllers/UserController";

export const userApiRouter = Router()

userApiRouter.get('/', UserController.getAll)
userApiRouter.get('/:username', UserController.getByUsername);
