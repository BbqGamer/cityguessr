import express, { Request, Response, NextFunction } from 'express';
import { indexRouter } from './routes';
import path from 'path';
import { db } from './services/db';
import session from 'express-session';
import config from '../config.json';
import http from 'http';
import { Server } from 'socket.io';
import { handleConnection } from './services/game';
import { SessionUser } from './models/User'


const app = express();
const server = http.createServer(app);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

declare module 'express-session' {
    interface SessionData {
        user?: SessionUser,
        filters: {
            ids: number[];
            distances: number[];
        }
    }
}

export const gameSettings = {
    countdown: 30,
    cityQuery: 'European cities',
    cityQuerySize: 30
}

const sessionMiddleware = session({
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
})

app.use(sessionMiddleware);

app.use('/', indexRouter);
app.use((req: Request, res: Response) => {
    res.status(404).render('status/404', { user: req.session.user, error: 'Page not found' });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
        return next(err)
    }
    res.status(500).render('status/500', { user: req.session.user, error: err })
});

const io = new Server(server);
io.engine.use(sessionMiddleware);

io.on('connection', (socket) => {
    handleConnection(io, socket);
});

server.listen(3001, () => {
    console.log('Server running on http://localhost:3001');
})

process.on('SIGINT', () => {
    db.close();
    process.exit();
})