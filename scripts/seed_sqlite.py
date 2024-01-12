import sqlite3
import json

DB_FILE = '../data/db.sqlite3'


def create_table():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS cities (
            id INTEGER PRIMARY KEY,
            name TEXT,
            url TEXT,
            country_name TEXT,
            country_url TEXT,
            country_flag_url TEXT,
            logitude TEXT,
            latitude TEXT,
            description TEXT,
            infobox TEXT
        )
    ''')


def seed_table():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()

    with open('../data/cities.json', 'r') as f:
        seed = json.load(f)

    for city in seed['cities']:
        cursor.execute('''
            INSERT INTO cities (
                name,
                url,
                country_name,
                country_url,
                country_flag_url,
                logitude,
                latitude,
                description,
                infobox
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            city['name'],
            city['url'],
            city['country'],
            city['country_url'],
            city['country_flag'],
            city['longitude'],
            city['latitude'],
            city['description'],
            city['infobox']
        ))
    conn.commit()


create_table()
seed_table()
