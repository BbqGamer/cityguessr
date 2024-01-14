import { NextFunction, Request, Response } from "express"
import { UserModel, User } from "../models/User";
import { sendActivationEmail } from "./activation";
import { hashPassword, getSalt, validatePassword } from "./password";


export function auth(req: Request, res: Response, next: NextFunction) {
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

function authenticate(username: string, password: string, cb: (err: any, user?: User, message?: string) => void) {
    UserModel.get('username', username, (err, user) => {
        if (err) { return cb(err, undefined, "There was error retrieving user"); }
        if (!user) { return cb(null, undefined, "User does not exist"); }
        if (!validatePassword(password, user.hashed_password, user.salt)) { return cb(null, undefined, "Wrong password"); }
        return cb(null, user);
    });
}

export function register(req: Request, res: Response, next: NextFunction) {
    if (req.session.user) {
        res.redirect('/'); // The user is already logged in
        return;
    }
    if (!req.body.username || !req.body.password || !req.body.email) {
        res.render('register', { user: req.session.user, error: "Please fill out all fields" });
        return;
    }
    var salt = getSalt();
    const user: User = {
        id: -1,
        username: req.body.username,
        hashed_password: hashPassword(req.body.password, salt),
        salt: salt,
        email: req.body.email,
        email_verified: false,
        privilege: 0
    }
    UserModel.create(user, (err, user, message) => {
        if (err) { next(err); }
        else if (!user) {
            if (!message) { message = "Unknown error"; }
            res.render('register', { user: req.session.user, error: message });
        } else {
            sendActivationEmail(user);
            req.session.user = {
                user_id: user.id,
                username: user.username,
                privilege: user.privilege,
                activated: false
            }
            res.render('register-success', { user: req.session.user })
        }
    });
}