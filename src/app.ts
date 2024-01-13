import Express from 'express';
import { authRouter } from './routes/auth';
import { indexRouter } from './routes';
import path from 'path';
import { db } from './services/db';
import session from 'express-session';
import config from '../config.json';


const app = Express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(Express.json());
app.use(Express.urlencoded({ extended: false }));
app.use(Express.static(path.join(__dirname, 'public')));

declare module 'express-session' {
    interface SessionData {
        user?: {
            user_id: number;
            username: string;
        }
    }
}

app.use(session({
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}))

app.use('/', indexRouter);
app.use('/', authRouter);

app.listen(3001, () => {
    console.log('Server running on http://localhost:3001');
})

process.on('SIGINT', () => {
    db.close();
    process.exit();
})