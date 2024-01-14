import { UserModel, User } from "../models/User";
import { sendActivationEmail } from "./activation";
import { hashPassword, getSalt, validatePassword } from "./password";


export function authenticate(username: string, password: string, cb: (err: any, user?: User, message?: string) => void) {
    UserModel.get('username', username, (err, user) => {
        if (err) { return cb(err, undefined, "There was error retrieving user"); }
        if (!user) { return cb(null, undefined, "User does not exist"); }
        if (!validatePassword(password, user.hashed_password, user.salt)) { return cb(null, undefined, "Wrong password"); }
        return cb(null, user);
    });
}

export function createUser(username: string, password: string, email: string, cb: (err: any, user?: User, message?: string) => void) {
    var salt = getSalt();
    const user: User = {
        id: -1,
        username: username,
        hashed_password: hashPassword(password, salt),
        salt: salt,
        email: email,
        email_verified: false,
        privilege: 0
    }
    UserModel.create(user, (err, user, message) => {
        if (err) { return cb(err) }
        if (!user) {
            if (!message) { message = "Unknown error"; }
            return cb(null, undefined, message);
        }
        sendActivationEmail(user, (err) => {
            if (err) { return cb(err); }
            cb(null, user, 'Account created successfully, check your email to activate it');
        });
    });
}