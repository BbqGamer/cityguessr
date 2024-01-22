import { City } from "../models/City";
import { CityModel, Callback } from "../models/City";
import { closestCities } from "./chroma/collection";

const NUM_CANDIDATES = 30;

export function getRandomCity(prompt: string, cb: Callback<[City, City[]]|null>) {
    closestCities(prompt, NUM_CANDIDATES).then(([err, ids, distances]) => {
        if (err) { return cb(err); }
        const index = Math.floor(Math.random() * ids.length);
        const id = ids[index];
        CityModel.getAll(0, 1000, (err, cities) => {
            if (err) { return cb(err); }
            if (!cities) { return cb(new Error('No cities found')); }
            const city = cities.find(city => city.id === id);
            if (!city) { return cb(new Error('City not found')); }
            const candidates = cities.filter(city => ids.includes(city.id));
            cb(null, [city, candidates]);
        })
    })
}