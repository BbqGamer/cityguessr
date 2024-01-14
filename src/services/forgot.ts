import { Request, Response, NextFunction } from "express";
import { transporter } from "./email";
import { v4 } from "uuid";
import { TokenModel } from "../models/Token";
import { UserModel } from "../models/User";
import { getSalt, hashPassword } from "./password";


export function forgotPassword(req: Request, res: Response) {
    res.render('forgot', { user: req.session.user, error: '' });
}

export function sendForgotPasswordEmail(req: Request, res: Response, next: NextFunction) {
    if (!req.body.email) {
        res.render('forgot', { user: req.session.user, error: 'Please enter your email' });
        return;
    }

    const token = v4();
    UserModel.get('email', req.body.email, (err, user) => {
        if (err) { return next(err); }
        if (!user) {
            res.render('forgot', { user: req.session.user, error: 'User does not exist' });
            return;
        }
        TokenModel.create(user.id, token, "forgot", (err, activation) => {
            if (err) { next(err); }
            else {
                transporter.sendMail({
                    from: 'noreply@localhost',
                    to: req.body.email,
                    subject: 'Reset your password',
                    text: `Please click the following link to reset your password: http://localhost:3001/auth/reset/${token}`,
                });
                res.render('forgot-sent', { user: req.session.user, email: req.body.email });
            }
        })
    })
}

export function resetPasswordPage(req: Request, res: Response, next: NextFunction) {
    if (!req.params.token) {
        next(new Error('No token provided'));
    } else {
        res.render('reset', { user: req.session.user, token: req.params.token, error: '' });
    }
}

export function resetPassword(req: Request, res: Response, next: NextFunction) {
    console.log('resetting');
    if (!req.params.token || !req.body.password) {
        next(new Error('No token or password provided'));
    } else {
        TokenModel.get(req.params.token, (err, token) => {
            if (err) { next(err); }
            else if (!token || token.purpose !== "forgot") {
                res.render('status/401', { user: req.session.user, error: 'Invalid token' });
            } else {
                const DAY = 24 * 60 * 60 * 1000;
                if (Date.now() - new Date(token.created_at).getMilliseconds() < DAY) {
                    res.render('status/401', { user: req.session.user, error: 'Token expired' });
                } else {
                    const salt = getSalt();
                    const hpass = hashPassword(req.body.password, salt);
                    UserModel.update(token.user_id, { salt: salt, hashed_password: hpass }, (err, user) => {
                        if (err) { next(err); }
                        else {
                            if (!user) {
                                next(new Error('User not found'));
                            } else {
                                res.render('reset-success', { user: req.session.user, username: user.username });
                            }
                        }
                    })
                }
            }
        })
    }
}