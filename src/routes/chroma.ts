import { getCollection, createCollection } from '../services/chroma/collection';
import { Router } from 'express';
import { ChromaClient } from 'chromadb';

const chromaRouter = Router();
const client = new ChromaClient()

chromaRouter.get('/collection/get/:name', async (req, res) => {
    res.end(await getCollection(client, req.params.name));
});

chromaRouter.get('/collection/create/:name', async (req, res) => {
    res.end(await createCollection(client, req.params.name));
})
