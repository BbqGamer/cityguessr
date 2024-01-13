import { Request, Response } from "express";
import { UserModel } from "../../models/User";


export class UserControllerApi {
    static async getAll(req: Request, res: Response): Promise<void> {
        UserModel.getAll((err, users) => {
            if (err) { res.sendStatus(500); } else {
                res.json(users);
            }
        });
    }

    static async getByUsername(req: Request, res: Response): Promise<void> {
        UserModel.getByUsername(req.params.username, (err, user) => {
            if (err) { return res.sendStatus(500); }
            if (!user) { return res.sendStatus(404); }
            else {
                res.json(user);
            }
        });
    }
}