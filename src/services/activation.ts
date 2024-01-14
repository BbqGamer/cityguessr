import { User } from "../models/User";
import { v4 } from 'uuid';
import { TokenModel } from "../models/Token";
import { UserModel } from "../models/User";
import { transporter } from "./email";

export function sendActivationEmail(user: User, cb: (err?: Error) => void) {
    const token = v4();
    TokenModel.create(user.id, token, "activation", (err, activation) => {
        if (err) { return cb(err); }
        const url = `http://localhost:3001/auth/activate/${token}`;
        console.debug('Sending email to ' + user.email);
        transporter.sendMail({
            from: 'noreply@localhost',
            to: user.email,
            subject: 'Activate your account',
            text: `Please click the following link to activate your account: ${url}`,
        });
        cb();
    })
}


export function activateAccount(token: string, cb: (err?: Error, message?: string, user_id?: number) => void) {
    TokenModel.get(token, (err, token) => {
        if (err) { return cb(err); }
        if (!token || token.purpose !== "activation") {
            return cb(undefined, 'Invalid token');
        }

        const DAY = 24 * 60 * 60 * 1000;
        if (Date.now() - new Date(token.created_at).getMilliseconds() < DAY) {
            return cb(undefined, 'Token expired');
        }

        UserModel.update(token.user_id, { email_verified: true }, (err, user) => {
            if (err) { return cb(err); }
            if (!user) { return cb(undefined, 'User not found') }
            cb(undefined, 'Account created successfully', token.user_id);
        })
    })
}
