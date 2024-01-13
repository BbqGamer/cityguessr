import { Request, Response, Router } from "express";
import { UserModel } from "../models/User";


export class UserController {
    static async getAll(req: Request, res: Response): Promise<void> {
        if (!req.session.user) {
            res.redirect('/auth/login');
            return;
        }
        console.log(req.session.user);
        if (req.session.user.privilege < 1) {
            res.status(401).render('status/401');
            return;
        }
        UserModel.getAll((err, users) => {
            if (err) { res.sendStatus(500); }
            else {
                res.render('users', { users: users });
            }
        });
    }
}

export const userRouter = Router();
userRouter.get('/', UserController.getAll);
