import { NextFunction, Request, Response, Router } from "express";
import { UserModel } from "../models/User";


export class UserController {
    static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        if (!req.session.user) {
            res.redirect('/auth/login');
            return;
        }
        if (req.session.user.privilege < 1) {
            res.status(401).render('status/401', { user: req.session.user, error: 'Unauthorized' });
            return;
        }
        UserModel.getAll((err, users) => {
            if (err) { next(err) }
            else {
                res.render('users', { user: req.session.user, users: users });
            }
        });
    }

    static async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
        if (!req.session.user) {
            res.redirect('/auth/login');
            return;
        }

        UserModel.get('id', req.session.user.user_id, (err, user) => {
            if (err) { next(err) }
            else {
                res.render('profile', { user: req.session.user, profile: user });
            }
        });
    }
}
