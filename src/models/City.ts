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
    added_at: string;
    similarity: string | null; // used for search
}

const cols = [
    'id', 'name', 'url', 'country_name', 'country_url', 'country_flag_url', 'longitude',
    'latitude', 'description', 'infobox', 'added_by', 'added_by', 'added_at'
].map(col => 'cities.' + col)

export type Callback<T> = (error: any, city?: T) => void;

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

    static getByUser(user_id: number, cb: Callback<City | null>) {

        const query = `SELECT ${cols}, users.username AS added_by_username
                        FROM cities JOIN users ON cities.added_by = users.id
                        WHERE cities.added_by = ?`;

        db.all(query, [user_id], (err, row: City) => {
            if (err) { return cb(err); }
            if (row) {
                return cb(null, row);
            } else {
                return cb(null, null);
            }
        });
    }

    static addOne(city: Partial<City>, user_id: number, cb: Callback<Partial<City>>) {
        const query = `INSERT INTO cities (name, url, country_name, country_url, country_flag_url, longitude, latitude, description, infobox, added_by, added_at)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const defaultCity: Partial<City> = {
            name: '',
            url: '',
            country_name: '',
            country_url: '',
            country_flag_url: '',
            longitude: 0,
            latitude: 0,
            description: '',
            infobox: '',
            added_by: user_id,
            added_at: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') 
        }

        city = { ...defaultCity, ...city };
        console.log("Adding city ", city.name)
        db.run(query, [
            city.name, city.url, city.country_name, city.country_url, city.country_flag_url,
            city.longitude, city.latitude, city.description, city.infobox, city.added_by, city.added_at
        ], function (err) {
            if (err) { return cb(err); }
            city.id = this.lastID;
            cb(null, city);
        });
    }

    static deleteOne(city_id: number, user: any, cb: Callback<null>) {
        let query = 'DELETE FROM cities WHERE id = ?';
        let params = [city_id];
        if (user.privilege < 1) {
            query = query + ` AND added_by = ?`
            params.push(user.user_id)
        }

        db.run(query, params, function (err) {
            if (err) { return cb(err); }
            cb(null);
        });
    }
}
