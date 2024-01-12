import OpenAI from 'openai';
import Express from 'express';
import { ChromaClient, OpenAIEmbeddingFunction } from 'chromadb';
import config from '../config.json';


function main() {
    const app = Express();
    const client = new ChromaClient();

    const embedder = new OpenAIEmbeddingFunction({
        openai_api_key: config.OPENAI_API_KEY,
    });

    app.get('/query/:message', async (req, res) => {
        var response = await queryopenai(req.params.message);
        res.end(JSON.stringify({
            response: response
        }))
    });

    app.get('/collection', async (req, res) => {
        client.getCollection({
            name: 'chroma',
            embeddingFunction: embedder,
        }).then(async collection => {
            var peek = await collection.peek();
            var count = await collection.count();
            res.end(JSON.stringify({
                peek: peek,
                count: count
            }))
        }).catch(err => {
            res.end(JSON.stringify({
                error: err.message
            }))
            console.error(err.message);
        })
    });

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
