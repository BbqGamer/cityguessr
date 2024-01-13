import { NextFunction, Request, Response } from "express";
import { UserModel } from "../../models/User";


export class UserControllerApi {
    static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        UserModel.getAll((err, users) => {
            if (err) { next(err); } else {
                res.json(users);
            }
        });
    }

    static async getByUsername(req: Request, res: Response, next: NextFunction): Promise<void> {
        UserModel.get('username', req.params.username, (err, user) => {
            if (err) { next(err); }
            else if (!user) { return res.sendStatus(404); }
            else {
                res.json(user);
            }
        });
    }
}
