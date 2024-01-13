import { Router } from "express";
import { UserControllerApi } from "../../controllers/api/UserController";

export const userApiRouter = Router()

userApiRouter.get('/', UserControllerApi.getAll)
userApiRouter.get('/:username', UserControllerApi.getByUsername);
