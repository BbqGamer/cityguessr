import OpenAI from 'openai';
import Express from 'express';
import { ChromaClient } from 'chromadb';
import { getCollection, createCollection } from './chroma/collection';


function main() {
    const app = Express();
    const client = new ChromaClient();

    app.get('/query/:message', async (req, res) => {
        var response = await queryopenai(req.params.message);
        res.end(JSON.stringify({
            response: response
        }))
    });

    app.get('/collection/get/:name', async (req, res) => {
        res.end(await getCollection(client, req.params.name));
    });

    app.get('/collection/create/:name', async (req, res) => {
        res.end(await createCollection(client, req.params.name));
    })

    const openai = new OpenAI();

    async function queryopenai(query: string): Promise<string | null> {
        console.log('Querying OpenAI');
        const chatCompletion = await openai.chat.completions.create({
            messages: [{ role: 'user', content: query }],
            model: 'gpt-3.5-turbo',
        });
        return chatCompletion.choices[0].message.content;
    }

    app.listen(3000, () => {
        console.log('Server running on http://localhost:3000');
    })
}

main()
