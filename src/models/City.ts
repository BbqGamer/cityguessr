import { db } from '../services/db';


export interface City {
    id: number;
    name: string;
    url: string;
    country_name: string;
    country_url: string;
    country_flag_url: string;
    longitude: number;
    latitude: number;
    description: string;
    infobox: string;
}

type Callback<T> = (error: any, city?: T) => void;

export class CityModel {
    static getAll(cb: Callback<City[]>) {
        const query = 'SELECT * FROM cities';

        db.all(query, (err, rows: City[]) => {
            if (err) { return cb(err); }
            if (rows && rows.length > 0) {
                cb(null, rows);
            }
        });
    }

    static getById(city_id: number, cb: Callback<City | null>) {
        const query = 'SELECT * FROM cities WHERE id = ? LIMIT 1';

        db.get(query, [city_id], (err, row: City) => {
            if (err) { return cb(err); }
            if (row) {
                return cb(null, row);
            } else {
                return cb(null, null);
            }
        });
    }
}
