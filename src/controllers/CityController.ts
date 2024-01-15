import { NextFunction, Request, Response, Router } from "express";
import { CityModel } from "../models/City";
import { closestCities } from "../services/chroma/collection";
import config from '../../config.json'

export class CityController {
    static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        const PAGE_SIZE = 8;
        CityModel.getAll(0, 1000, (err, cities) => {
            if (err) { return next(err); }
            if (!cities) { return res.sendStatus(404); }
            if (req.query.clear) {
                delete req.session.filters;
            }
            if (req.session.filters) {
                const ids = req.session.filters.ids;
                console.log("Filtering cities", ids)
                cities = cities.filter(city => ids.includes(city.id))
            }
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

    static async ragQuery(req: Request, res: Response, next: NextFunction): Promise<void> {
        const query = req.body.query;
        const [err, ids, distances] = await closestCities(query, req.body.n_results)
        if (err) { return next(err); }
        if (!req.session.filters) {
            req.session.filters = {
                ids: [],
                distances: []
            }
        }
        console.log(ids, distances)
        req.session.filters.ids = ids;
        req.session.filters.distances = distances;
        res.redirect('/cities');
    }
}

export const cityRouter = Router();
cityRouter.get('/', CityController.getAll);
cityRouter.post('/', CityController.ragQuery);
cityRouter.get('/:id', CityController.getOne);
