import { Request, Response, Router } from "express";
import { CityModel } from "../models/City";


export class CityController {
    static async getAll(req: Request, res: Response): Promise<void> {
        CityModel.getAll((err, cities) => {
            if (err) {
                res.sendStatus(500);
            } else {
                res.json(cities);
            }
        });
    }

    static async getOne(req: Request, res: Response): Promise<void> {
        CityModel.getOne(req, (err, city) => {
            if (err) {
                res.sendStatus(500);
            } else {
                res.json(city);
            }
        });
    }
}

export const cityRouter = Router();

cityRouter.get('/', CityController.getAll);
cityRouter.get('/:id', CityController.getOne);
