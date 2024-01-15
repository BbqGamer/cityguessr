import { ChromaClient, QueryResponse } from "chromadb";
import { embedder } from "./embed";

const client = new ChromaClient();

export async function getCollection(client: ChromaClient, name: string): Promise<string> {
    try {
        const collection = await client.getCollection({
            name: name,
            embeddingFunction: embedder,
        })

        var peek = await collection.peek();
        var count = await collection.count();
        return JSON.stringify({
            peek: peek,
            count: count
        })
    } catch (err) {
        return JSON.stringify({
            error: err.message
        })
    }
}

export async function createCollection(client: ChromaClient, name: string): Promise<string> {
    try {
        await client.createCollection({
            name: name,
            embeddingFunction: embedder,
        })

        return JSON.stringify({
            success: true
        })
    } catch (err) {
        return JSON.stringify({
            error: err.message
        })
    }
}

type Result = [Error | null, number[], number[]];

export async function closestCities(query: string, n_results: number): Promise<Result> {
    const NAME = 'cities';
    try {
        const collection = await client.getCollection({
            name: NAME,
            embeddingFunction: embedder,
        })

        const result = await collection.query({
            nResults: n_results,
            queryTexts: query
        })
        console.log(result);

        if (!result.distances) {
            return [new Error('No results found'), [], []]
        }
        const ids = result.ids[0].map(id => Number(id))
        return [null, ids, result.distances[0]]
    } catch (err) {
        return err
    }
}