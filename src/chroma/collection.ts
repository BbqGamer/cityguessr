import { ChromaClient } from "chromadb";
import { embedder } from "./embed";

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