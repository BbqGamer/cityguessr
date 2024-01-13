import { Router } from "express";
import { CityControllerApi } from "../../controllers/api/CityController";

export const cityApiRouter = Router();

cityApiRouter.get('/', CityControllerApi.getAll);
cityApiRouter.get('/:id', CityControllerApi.getOne);
