import { NextFunction, Request, Response } from "express";
import { CityModel } from "../../models/City";


export class CityControllerApi {
    static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        CityModel.getAll((err, cities) => {
            if (err) { next(err); } else {
                res.json(cities);
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
