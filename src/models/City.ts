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
    added_by: number;
    added_by_username: string;
    added_at: Date;
}

const cols = [
    'id', 'name', 'url', 'country_name', 'country_url', 'country_flag_url', 'longitude',
    'latitude', 'description', 'infobox', 'added_by', 'added_by', 'added_at'
].map(col => 'cities.' + col)

type Callback<T> = (error: any, city?: T) => void;

export class CityModel {
    static getAll(offset: number, limit: number, cb: Callback<City[]>) {
        const query = `SELECT ${cols}, users.username AS added_by_username 
                        FROM cities JOIN users ON cities.added_by = users.id
                        LIMIT ? OFFSET ?`;

        db.all(query, [limit, offset], (err, rows: City[]) => {
            if (err) { return cb(err); }
            cb(null, rows);
        });
    }

    static getById(city_id: number, cb: Callback<City | null>) {

        const query = `SELECT ${cols}, users.username AS added_by_username
                        FROM cities JOIN users ON cities.added_by = users.id
                        WHERE cities.id = ? LIMIT 1`;

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
