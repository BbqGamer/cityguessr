import { NextFunction, Request, Response, Router } from "express";
import { CityModel } from "../models/City";


export class CityController {
    static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        CityModel.getAll((err, cities) => {
            if (err) { next(err); } else {
                res.render('cities', { user: req.session.user, cities: cities });
            }
        });
    }

    static async getOne(req: Request, res: Response, next: NextFunction): Promise<void> {
        CityModel.getById(Number(req.params.id), (err, city) => {
            if (err) { next(err); }
            else if (!city) { return res.sendStatus(404); }
            else {
                res.json(city);
            }
        });
    }
}

export const cityRouter = Router();
cityRouter.get('/', CityController.getAll);
cityRouter.get('/:id', CityController.getOne);
