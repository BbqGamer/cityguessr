import { NextFunction, Request, Response } from "express";
import { createTransport } from "nodemailer";
import { User } from "../models/User";
import { v4 } from 'uuid';
import { ActivationModel } from "../models/Activation";
import { UserModel } from "../models/User";

const transporter = createTransport({
    host: "localhost",
    port: 1025
});

export const sendActivationEmail = (user: User) => {
    const token = v4();
    ActivationModel.create(user.id, token, (err, activation) => {
        if (err) { console.error(err); }
        else {
            const url = `http://localhost:3001/auth/activate/${token}`;
            transporter.sendMail({
                from: 'noreply@localhost',
                to: user.email,
                subject: 'Activate your account',
                text: `Please click the following link to activate your account: ${url}`,
            });
        }
    })
}


export function activate(req: Request, res: Response, next: NextFunction) {
    ActivationModel.get(req.params.token, (err, activation) => {
        if (err) { next(err); }
        else if (!activation) {
            res.render('status/401', { user: req.session.user, error: 'Invalid token' });
        } else {
            const DAY = 24 * 60 * 60 * 1000;
            console.log(activation.created_at);
            if (Date.now() - new Date(activation.created_at).getMilliseconds() < DAY) {
                res.render('status/401', { user: req.session.user, error: 'Token expired' });
            } else {
                UserModel.update(activation.user_id, { email_verified: true }, (err, user) => {
                    if (err) { next(err); }
                    else {
                        if (!user) {
                            next(new Error('User not found'));
                        } else {
                            if (req.session.user && req.session.user.user_id === activation.user_id) {
                                req.session.user.activated = true;
                            }
                            res.render('activation-success', { user: req.session.user, username: "haha" });
                        }
                    }
                })
            }
        }
    })
}
