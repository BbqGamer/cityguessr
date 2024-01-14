import { NextFunction, Request, Response } from 'express';
import { authenticate, createUser } from '../../services/auth';

export class AuthController {
    static async loginPage(req: Request, res: Response) {
        res.render('login', { user: req.session.user, error: '' });
    }

    static async login(req: Request, res: Response, next: NextFunction) {
        if (req.session.user) {
            res.redirect('/'); // The user is already logged in
            return;
        }
        authenticate(req.body.username, req.body.password, (err, user, message) => {
            if (err) { next(err); }
            else if (!user) {
                res.render('login', { user: req.session.user, error: message });
            } else {
                req.session.user = {
                    user_id: user.id,
                    username: user.username,
                    privilege: user.privilege,
                    activated: user.email_verified
                }
                res.redirect('/');
            }
        });
    }


    static async registerPage(req: Request, res: Response) {
        res.render('register', { user: req.session.user, error: '' });
    }

    static async register(req: Request, res: Response, next: NextFunction) {
        if (req.session.user) {
            res.redirect('/'); // The user is already logged in
            return;
        }
        if (!req.body.username || !req.body.password || !req.body.email) {
            res.render('register', { user: req.session.user, error: "Please fill out all fields" });
            return;
        }
        createUser(req.body.username, req.body.password, req.body.email, (err, user, message) => {
            if (err) { return next(err); }
            if (!user) {
                res.render('register', { user: req.session.user, error: message });
                return;
            }
            req.session.user = {
                user_id: user.id,
                username: user.username,
                privilege: user.privilege,
                activated: false
            }
            res.render('success', {
                user: req.session.user,
                message: "Account created successfully, check your email to activate it"
            })
        })
    }


    static async logout(req: Request, res: Response, next: NextFunction) {
        if (req.session.user) {
            req.session.destroy((err) => { next(err); });
        }
        res.redirect('/');
    }

    static async resetPasswordPage(req: Request, res: Response) {
        var error = '';
        if (!req.params.token) { error = 'No token provided'; }
        res.render('reset', { user: req.session.user, token: req.params.token, error: '' });
    }

    static async forgotPasswordPage(req: Request, res: Response) {
        res.render('forgot', { user: req.session.user, error: '' });
    }
}