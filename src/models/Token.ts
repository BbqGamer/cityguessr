import { db } from '../services/db';


type Purpose = "activation" | "password_reset";

export interface Token {
    user_id: number;
    activation_token: string;
    created_at: Date;
    purpose: Purpose;
}

type Callback<T> = (error: any, token?: T) => void;

export class TokenModel {
    static create(user_id: number, activation_token: string, purpose: Purpose, cb: Callback<Token>) {
        const query = 'INSERT INTO tokens (user_id, activation_token, purpose) VALUES (?, ?, ?)';
        db.run(query, [user_id, activation_token, purpose], function (err) {
            if (err) { return cb(err); }
            return cb(null, { user_id, activation_token, purpose, created_at: new Date() });
        });
    }

    static get(token: string, cb: Callback<Token | null>) {
        const query = 'SELECT * FROM tokens WHERE activation_token = ? LIMIT 1';
        db.get(query, [token], (err, row: Token) => {
            if (err) { return cb(err); }
            if (row) {
                return cb(null, row);
            } else {
                return cb(null, null);
            }
        });
    }
}