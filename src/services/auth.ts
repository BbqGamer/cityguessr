import { Request, Response } from "express"
import crypto from "crypto";
import { UserModel, User } from "../models/User";


// define authenticaton middleware
export function auth(req: Request, res: Response) {
    authenticate(req.body.username, req.body.password, (err, user, message) => {
        if (err) { return res.sendStatus(500); }
        if (!user) { return res.status(401).send(message); }
        else { return res.redirect('/'); }
    });
}

function authenticate(username: string, password: string, cb: (err: any, user?: User, message?: string) => void) {
    UserModel.getByUsername(username, (err, user) => {
        if (err) { return cb(err, undefined, "There was error retrieving user"); }
        if (!user) { return cb(null, undefined, "User does not exist"); }
        if (!validatePassword(user, password)) { return cb(null, undefined, "Wrong password"); }
        return cb(null, user);
    });
}

function validatePassword(user: User, password: string): boolean {
    const hash = crypto.pbkdf2Sync(password, user.salt, 310000, 32, 'sha256')
    return crypto.timingSafeEqual(user.hashed_password, hash)
}
