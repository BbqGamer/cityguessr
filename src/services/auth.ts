import { NextFunction, Request, Response } from "express"
import crypto from "crypto";
import { UserModel, User } from "../models/User";


const HASH_ALG = 'sha256';
const HASH_ITER = 310000;
const HASH_KEYLEN = 32;

export function auth(req: Request, res: Response, next: NextFunction) {
    if (req.session.user) {
        res.redirect('/'); // The user is already logged in
        return;
    }
    authenticate(req.body.username, req.body.password, (err, user, message) => {
        if (err) { next(err); }
        else if (!user) { return res.status(401).send(message); }
        else {
            req.session.user = {
                user_id: user.id,
                username: user.username,
                privilege: user.privilege
            }
            res.redirect('/');
        }
    });
}

function authenticate(username: string, password: string, cb: (err: any, user?: User, message?: string) => void) {
    UserModel.get('username', username, (err, user) => {
        if (err) { return cb(err, undefined, "There was error retrieving user"); }
        if (!user) { return cb(null, undefined, "User does not exist"); }
        if (!validatePassword(user, password)) { return cb(null, undefined, "Wrong password"); }
        return cb(null, user);
    });
}

function validatePassword(user: User, password: string): boolean {
    const hash = crypto.pbkdf2Sync(password, user.salt, HASH_ITER, HASH_KEYLEN, HASH_ALG)
    return crypto.timingSafeEqual(user.hashed_password, hash)
}


export function register(req: Request, res: Response, next: NextFunction) {
    if (req.session.user) {
        res.redirect('/'); // The user is already logged in
        return;
    }
    if (!req.body.username || !req.body.password || !req.body.email) {
        res.redirect('/auth/register');
        return;
    }
    const user: User = {
        id: -1,
        username: req.body.username,
        hashed_password: crypto.pbkdf2Sync(req.body.password, crypto.randomBytes(32), HASH_ITER, HASH_KEYLEN, HASH_ALG),
        salt: crypto.randomBytes(32),
        email: req.body.email,
        email_verified: false,
        privilege: 0
    }
    UserModel.create(user, (err, user, message) => {
        if (err) { next(err); }
        else if (!user) {
            if (!message) { message = "Unknown error"; }
            res.render('register', { message: message });
        } else {
            req.session.user = {
                user_id: user.id,
                username: user.username,
                privilege: user.privilege
            }
            res.redirect('/');
        }
    });
}