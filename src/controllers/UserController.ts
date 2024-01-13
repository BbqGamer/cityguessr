import { NextFunction, Request, Response, Router } from "express";
import { UserModel } from "../models/User";


export class UserController {
    static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        if (!req.session.user) {
            res.redirect('/auth/login');
            return;
        }
        if (req.session.user.privilege < 1) {
            res.status(401).render('status/401');
            return;
        }
        UserModel.getAll((err, users) => {
            if (err) { next(err) }
            else {
                res.render('users', { users: users });
            }
        });
    }
}

export const userRouter = Router();
userRouter.get('/', UserController.getAll);
