import { NextFunction, Request, Response } from 'express';

export class AuthController {
    static async loginPage(req: Request, res: Response) {
        res.render('login', { user: req.session.user, error: '' });
    }

    static async registerPage(req: Request, res: Response) {
        res.render('register', { user: req.session.user, error: '' });
    }

    static async logout(req: Request, res: Response, next: NextFunction) {
        if (req.session.user) {
            req.session.destroy((err) => { next(err); });
        }
        res.redirect('/');
    }
}