import express, { Request, Response, NextFunction } from 'express';
import { indexRouter } from './routes';
import path from 'path';
import { db } from './services/db';
import session from 'express-session';
import config from '../config.json';


const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

declare module 'express-session' {
    interface SessionData {
        user?: {
            user_id: number;
            username: string;
            privilege: number;
        }
    }
}

app.use(session({
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}))

app.use('/', indexRouter);
app.use((req: Request, res: Response) => {
    res.status(404).render('status/404');
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
        return next(err)
    }
    res.status(500).render('status/500', { error: err })
});

app.listen(3001, () => {
    console.log('Server running on http://localhost:3001');
})

process.on('SIGINT', () => {
    db.close();
    process.exit();
})