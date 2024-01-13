import Express from 'express';
import { authRouter } from './routes/auth';
import { indexRouter } from './routes';
import path from 'path';
import { db } from './services/db';


const app = Express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(Express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/', authRouter);

app.listen(3001, () => {
    console.log('Server running on http://localhost:3001');
})

process.on('SIGINT', () => {
    db.close();
    process.exit();
})