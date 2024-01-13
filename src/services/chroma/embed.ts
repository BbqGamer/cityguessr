import config from '../../../config.json';
import { OpenAIEmbeddingFunction } from 'chromadb';

export const embedder = new OpenAIEmbeddingFunction({
    openai_api_key: config.OPENAI_API_KEY,
});
