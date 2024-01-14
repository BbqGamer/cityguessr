import { NextFunction, Request, Response, Router } from "express";
import { CityModel } from "../models/City";
import config from '../../config.json'

export class CityController {
    static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        const PAGE_SIZE = 8;
        CityModel.getAll(0, 1000, (err, cities) => {
            if (err) { return next(err); }
            if (!cities) { return res.sendStatus(404); }
            const page = req.query.page ? Number(req.query.page) : 1;
            const start = (page - 1) * PAGE_SIZE;
            const end = start + PAGE_SIZE;
            res.render('cities', {
                user: req.session.user,
                cities: cities.slice(start, end),
                page: page,
                totalPages: Math.ceil(cities.length / PAGE_SIZE)
            });
        });
    }

    static async getOne(req: Request, res: Response, next: NextFunction): Promise<void> {
        CityModel.getById(Number(req.params.id), (err, city) => {
            if (err) { next(err); }
            else if (!city) { return res.sendStatus(404); }
            else {
                res.render('city', { user: req.session.user, city: city, mapsApiKey: config.MAPS_API_KEY });
            }
        });
    }
}

export const cityRouter = Router();
cityRouter.get('/', CityController.getAll);
cityRouter.get('/:id', CityController.getOne);
