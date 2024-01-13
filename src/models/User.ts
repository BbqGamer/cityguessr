import { db } from '../services/db';

export interface User {
    id: number;
    username: string;
    hashed_password: Buffer;
    salt: Buffer;
    email: string;
    email_verified: boolean;
}

type Callback<T> = (error: any, user?: T) => void;

export class UserModel {
    static getByUsername(username: string, cb: Callback<User>) {
        const query = 'SELECT * FROM users WHERE username = ? LIMIT 1';
        db.get(query, [username], (err, row: User) => {
            if (err) { return cb(err); }

            if (row) {
                return cb(null, row);
            }
        });
    }

    static getAll(cb: Callback<User[]>) {
        const query = 'SELECT * FROM users';

        db.all(query, (err, rows: User[]) => {
            if (err) {
                return cb(err);
            }

            if (rows && rows.length > 0) {
                return cb(null, rows);
            }
        });
    }
}