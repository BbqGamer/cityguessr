import { transporter } from "./email";
import { v4 } from "uuid";
import { TokenModel } from "../models/Token";
import { UserModel } from "../models/User";
import { getSalt, hashPassword } from "./password";


export function forgotPassword(email: string, cb: (err?: Error, message?: string, success?: true) => void) {
    const token = v4();
    UserModel.get('email', email, (err, user) => {
        if (err) { return cb(err); }
        if (!user) { return cb(undefined, 'User does not exist'); }
        TokenModel.create(user.id, token, "forgot", (err, activation) => {
            if (err) { return cb(err); }
            transporter.sendMail({
                from: 'noreply@localhost',
                to: email,
                subject: 'Reset your password',
                text: `Please click the following link to reset your password: http://localhost:3001/auth/reset/${token}`,
            });
            cb(undefined, 'Check your email for a link to reset your password', true);
        })
    })
}

export function resetPassword(token: string, password: string, cb: (err?: Error, message?: string, success?: true) => void) {
    TokenModel.get(token, (err, token) => {
        if (err) { return cb(err); }
        if (!token || token.purpose !== "forgot") {
            return cb(undefined, 'Invalid token');
        }
        const DAY = 24 * 60 * 60 * 1000;
        if (Date.now() - new Date(token.created_at).getMilliseconds() < DAY) {
            return cb(undefined, 'Token expired');
        }
        const salt = getSalt();
        const hpass = hashPassword(password, salt);
        UserModel.update(token.user_id, { salt: salt, hashed_password: hpass }, (err, user) => {
            if (err) { return cb(err); }
            if (!user) { return cb(new Error('User not found')) };
            cb(undefined, 'Password reset successfully', true);
        })
    })
}
