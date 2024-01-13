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

type Callback<T> = (error: any, user?: T, message?: string) => void;

export class UserModel {
    static get(criteria: string, value: string, cb: Callback<User | null>) {
        const query = `SELECT * FROM users WHERE ${criteria} = ? LIMIT 1`;
        db.get(query, [value], (err, row: User) => {
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

    static insert(user: User, cb: (err: Error | null, user?: User) => void) {
        const query = 'INSERT INTO users (username, hashed_password, salt, email, email_verified) VALUES (?, ?, ?, ?, ?)';
        db.run(query, [user.username, user.hashed_password, user.salt, user.email, user.email_verified], function (err) {
            if (err) { return cb(err); }
            user.id = this.lastID;
            return cb(null, user);
        });
    }

    static create(user: User, cb: Callback<User | null>) {
        UserModel.get('username', user.username, (err, existingUser) => {
            if (err) { return cb(err); }
            if (existingUser) { return cb(null, null, "Username already taken"); }
            UserModel.get('email', user.email, (err, existingUser) => {
                if (err) { return cb(err); }
                if (existingUser) { return cb(null, null, "Email already taken"); }
                UserModel.insert(user, (err, user) => {
                    if (err) { return cb(err); }
                    return cb(null, user);
                });
            });
        });
    }
}