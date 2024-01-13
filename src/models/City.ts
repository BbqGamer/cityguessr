import { Request } from 'express';
import sqlite from 'sqlite3';


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

const DB_PATH = 'data/db.sqlite3';

export class CityModel {
    static getAll(callback: (error: Error | null, cities: City[]) => void) {
        const db = new sqlite.Database(DB_PATH);
        const query = 'SELECT * FROM cities';

        db.all(query, (err, rows: City[]) => {
            db.close();

            if (err) {
                return callback(err, []);
            }

            if (rows && rows.length > 0) {
                return callback(null, rows);
            }
        });
    }

    static getOne(req: Request, callback: (error: Error | null, city: City) => void) {
        const db = new sqlite.Database(DB_PATH);
        const query = 'SELECT * FROM cities WHERE id = ' + req.params.id + ' LIMIT 1';

        db.get(query, (err, row: City) => {
            db.close();

            if (err) {
                return callback(err, CityModel.empty());
            }

            if (row) {
                return callback(null, row);
            }
        });
    }

    static empty(): City {
        return {
            id: 0,
            name: '',
            url: '',
            country_name: '',
            country_url: '',
            country_flag_url: '',
            longitude: 0,
            latitude: 0,
            description: '',
            infobox: '',
        };
    }
}
