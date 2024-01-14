import { Request, Response, NextFunction } from 'express';
import { activateAccount } from '../services/activation';

export class AccountController {
    static async resetPasswordPage(req: Request, res: Response) {
        var error = '';
        if (!req.params.token) { error = 'No token provided'; }
        res.render('reset', { user: req.session.user, token: req.params.token, error: '' });
    }

    static async forgotPasswordPage(req: Request, res: Response) {
        res.render('forgot', { user: req.session.user, error: '' });
    }

    static async activateAccount(req: Request, res: Response, next: NextFunction) {
        activateAccount(req.params.token, (err, message, user_id) => {
            if (err) { return next(err); }
            if (!user_id) {
                res.render('status/401', { user: req.session.user, error: message });
                return;
            }
            if (req.session.user && req.session.user.user_id === user_id) {
                req.session.user.activated = true; // Update the session
            }
            res.render('success', {
                user: req.session.user,
                message: message
            });
        })
    }
}
