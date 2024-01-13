import { Request, Response } from "express";
import { CityModel } from "../../models/City";


export class CityControllerApi {
    static async getAll(req: Request, res: Response): Promise<void> {
        CityModel.getAll((err, cities) => {
            if (err) { res.sendStatus(500); } else {
                res.json(cities);
            }
        });
    }

    static async getOne(req: Request, res: Response): Promise<void> {
        CityModel.getById(Number(req.params.id), (err, city) => {
            if (err) { return res.sendStatus(500); }
            if (!city) { return res.sendStatus(404); }
            else {
                res.json(city);
            }
        });
    }
}
