import chromadb
import chromadb.utils.embedding_functions as embedding_functions
import sqlite3
import json


def get_all_cities():
    DB_FILE = '../data/db.sqlite3'
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM cities')
    cities = cursor.fetchall()
    conn.close()
    return cities


if __name__ == "__main__":
    client = chromadb.PersistentClient('../data/chroma.db')

    with open('../config.json', 'r') as f:
        OPENAI_KEY = json.load(f)['OPENAI_API_KEY']

    openai_ef = embedding_functions.OpenAIEmbeddingFunction(
        api_key=OPENAI_KEY,
        model_name="text-embedding-ada-002"
    )

    collections = client.list_collections()
    if 'cities' not in collections:
        client.create_collection('cities')

    collection = client.get_collection(name='cities')

    ids = []
    documents = []
    for city in get_all_cities()[:5]:
        city_id = city[0]
        country_name = city[3]
        desc = city[-2]
        infobox = city[-1]
        to_embed = "\n".join([country_name, desc, infobox])
        ids.append(str(city_id))
        documents.append(to_embed)

    embeddings = openai_ef(documents)

    print("Adding cities to Chroma...")
    collection.add(
        embeddings=embeddings,
        documents=documents,
        ids=ids,
    )
    print("Done!")
