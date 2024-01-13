import { db } from '../services/db';


export interface Activation {
    user_id: number;
    activation_token: string;
    created_at: Date;
}

type Callback<T> = (error: any, activation?: T) => void;

export class ActivationModel {
    static create(user_id: number, activation_token: string, cb: Callback<Activation>) {
        const query = 'INSERT INTO activations (user_id, activation_token) VALUES (?, ?)';
        db.run(query, [user_id, activation_token], function (err) {
            if (err) { return cb(err); }
            return cb(null, { user_id, activation_token, created_at: new Date() });
        });
    }

    static get(token: string, cb: Callback<Activation | null>) {
        const query = 'SELECT * FROM activations WHERE activation_token = ? LIMIT 1';
        db.get(query, [token], (err, row: Activation) => {
            if (err) { return cb(err); }
            if (row) {
                return cb(null, row);
            } else {
                return cb(null, null);
            }
        });
    }
}