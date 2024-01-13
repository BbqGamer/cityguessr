import Express from 'express';
import { ChromaClient } from 'chromadb';
import { getCollection, createCollection } from './chroma/collection';
import { cityRouter } from './controllers/CityController';
import path from 'path';


function main() {
    const app = Express();
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');
    app.use(Express.static(path.join(__dirname, 'public')));

    const client = new ChromaClient();

    app.get('/', (req, res) => {
        res.render('index');
    });

    app.get('/collection/get/:name', async (req, res) => {
        res.end(await getCollection(client, req.params.name));
    });

    app.get('/collection/create/:name', async (req, res) => {
        res.end(await createCollection(client, req.params.name));
    })

    app.use('/cities', cityRouter);

    app.listen(3001, () => {
        console.log('Server running on http://localhost:3001');
    })
}

main()
