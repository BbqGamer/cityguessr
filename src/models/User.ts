import { db } from '../services/db';

export interface User {
    id: number;
    username: string;
    hashed_password: Buffer;
    salt: Buffer;
    email: string;
    email_verified: boolean;
    privilege: number;
}

type Callback<T> = (error: any, user?: T) => void;

export class UserModel {
    static getByUsername(username: string, cb: Callback<User | null>) {
        const query = 'SELECT * FROM users WHERE username = ? LIMIT 1';
        db.get(query, [username], (err, row: User) => {
            if (err) { return cb(err); }
            if (row) {
                return cb(null, row);
            } else {
                return cb(null, null);
            }
        });
    }

    static getAll(cb: Callback<User[]>) {
        const query = 'SELECT * FROM users';

        db.all(query, (err, rows: User[]) => {
            if (err) {
                return cb(err);
            }
            return cb(null, rows);
        });
    }

    static create(user: User, cb: Callback<User>) {
        const query = 'INSERT INTO users (username, hashed_password, salt, email, email_verified) VALUES (?, ?, ?, ?, ?)';
        db.run(query, [user.username, user.hashed_password, user.salt, user.email, user.email_verified], function (err) {
            if (err) { return cb(err); }
            user.id = this.lastID;
            return cb(null, user);
        });
    }
}