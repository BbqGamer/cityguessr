import { NextFunction, Request, Response } from 'express';
import { authenticate, createUser } from '../services/auth';

export class AuthController {
    static async loginPage(req: Request, res: Response) {
        res.render('login', { user: req.session.user, error: '' });
    }

    static async login(req: Request, res: Response, next: NextFunction) {
        if (req.session.user) {
            console.log(`User is already logged in (${req.session.user.username})`)
            res.redirect('/');
            return;
        }
        console.log(`Authenticating user ${req.body.username}`)
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
            console.log(`User is already logged in (${req.session.user.username})`)
            res.redirect('/');
            return;
        }
        if (!req.body.username || !req.body.password || !req.body.email) {
            res.render('register', { user: req.session.user, error: "Please fill out all fields" });
            return;
        }
        console.log(`Creating user ${req.body.username}`)
        createUser(req.body.username, req.body.password, req.body.email, (err, user, message) => {
            console.log(`Created user ${req.body.username}`)
            if (err) { return next(err); }
            if (!user) {
                console.log(`Failed to create user ${req.body.username}: ${message}`)
                res.render('register', { user: req.session.user, error: message });
                return;
            }
            console.log(`Created user ${req.body.username}`)
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


    static async logout(req: Request, res: Response) {
        if (req.session.user) {
            console.log(`Logging out user ${req.session.user.username}`)
            req.session.user = undefined;
        }
        res.redirect('/');
    }
}