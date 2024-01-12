import { Request, Response } from "express";
import { CityModel } from "../models/City";

export class CityController {
    static async getAll(req: Request, res: Response): Promise<void> {
        try {
            const cities = await CityModel.getAll();
            res.json(cities);
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }
}
