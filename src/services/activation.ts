import { NextFunction, Request, Response } from "express";
import { User } from "../models/User";
import { v4 } from 'uuid';
import { TokenModel } from "../models/Token";
import { UserModel } from "../models/User";
import { transporter } from "./email";

export function sendActivationEmail(user: User, cb: (result: Error | null) => void) {
    const token = v4();
    TokenModel.create(user.id, token, "activation", (err, activation) => {
        if (err) { return cb(err); }
        const url = `http://localhost:3001/auth/activate/${token}`;
        transporter.sendMail({
            from: 'noreply@localhost',
            to: user.email,
            subject: 'Activate your account',
            text: `Please click the following link to activate your account: ${url}`,
        });
    })
}


export function activate(req: Request, res: Response, next: NextFunction) {
    TokenModel.get(req.params.token, (err, token) => {
        if (err) { return next(err); }
        if (!token || token.purpose !== "activation") {
            return res.render('status/401', { user: req.session.user, error: 'Invalid token' });
        }

        const DAY = 24 * 60 * 60 * 1000;
        if (Date.now() - new Date(token.created_at).getMilliseconds() < DAY) {
            return res.render('status/401', { user: req.session.user, error: 'Token expired' });
        }

        UserModel.update(token.user_id, { email_verified: true }, (err, user) => {
            if (err) { return next(err); }
            if (!user) { return next(new Error('User not found')); }
            if (req.session.user && req.session.user.user_id === token.user_id) {
                req.session.user.activated = true;
            }
            res.render('success', {
                user: req.session.user,
                message: 'Account activated successfully'
            });
        })
    })
}
