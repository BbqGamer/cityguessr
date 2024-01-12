import sqlite from 'sqlite3';

const db = new sqlite.Database('data/db.sqlite3');

export interface City {
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

export class CityModel {
    static getAll(): Promise<City[]> {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM cities', (err, rows: City[]) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
}