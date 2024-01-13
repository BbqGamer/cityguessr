import Express from 'express';
import { ChromaClient } from 'chromadb';
import { getCollection, createCollection } from './chroma/collection';
import { cityRouter } from './controllers/CityController';


function main() {
    const app = Express();
    const client = new ChromaClient();

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
