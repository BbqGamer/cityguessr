import { createTransport } from "nodemailer";
import { User } from "../models/User";
import { v4 } from 'uuid';
import { ActivationModel } from "../models/Activation";

const transporter = createTransport({
    host: "localhost",
    port: 1025
});

export const sendActivationEmail = (user: User) => {
    const token = v4();
    ActivationModel.create(user.id, token, (err, activation) => {
        if (err) { console.error(err); }
        else {
            const url = `http://localhost:3001/auth/activate/${token}`;
            transporter.sendMail({
                from: 'noreply@localhost',
                to: user.email,
                subject: 'Activate your account',
                text: `Please click the following link to activate your account: ${url}`,
            });
        }
    })
}
