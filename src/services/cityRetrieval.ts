import { City } from "../models/City";
import { CityModel, Callback } from "../models/City";
import { closestCities } from "./chroma/collection";

const NUM_CANDIDATES = 30;

export function getRandomCity(prompt: string, cb: Callback<City|null>) {
    closestCities(prompt, NUM_CANDIDATES).then(([err, ids, distances]) => {
        if (err) { return cb(err); }
        const index = Math.floor(Math.random() * ids.length);
        const id = ids[index];
        CityModel.getById(id, cb)
    })
}