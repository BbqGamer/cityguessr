import { createTransport } from "nodemailer";

export const transporter = createTransport({
    host: "localhost",
    port: 1025
});
