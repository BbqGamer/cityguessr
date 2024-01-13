import { Router } from "express";
import { CityController } from "../../controllers/CityController";

export const cityApiRouter = Router();

cityApiRouter.get('/', CityController.getAll);
cityApiRouter.get('/:id', CityController.getOne);
