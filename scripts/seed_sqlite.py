import sqlite3
import json
import hashlib

DB_FILE = '../data/db.sqlite3'


def cleanup(cursor):
    cursor.execute('DROP TABLE IF EXISTS cities')
    cursor.execute('DROP TABLE IF EXISTS users')
    cursor.execute('DROP TABLE IF EXISTS activations')


def create_tables(cursor):
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

    cursor.execute("CREATE TABLE IF NOT EXISTS users ( \
        id INTEGER PRIMARY KEY, \
        username TEXT UNIQUE, \
        hashed_password BLOB, \
        salt BLOB, \
        email TEXT UNIQUE, \
        email_verified INTEGER, \
        privilege INTEGER DEFAULT 0 \
    )")

    cursor.execute('''CREATE TABLE IF NOT EXISTS activations (
        id INTEGER PRIMARY KEY,
        user_id INTEGER,
        activation_token TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )''')


def seed_cities(cursor):
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


def insert_user(cursor, username, password, salt, email, privilege):
    hashed_password = hashlib.pbkdf2_hmac(
        'sha256', password, salt, 310000, 32
    )
    cursor.execute('''
        INSERT INTO users (
            username, hashed_password, salt, email, email_verified, privilege
        ) VALUES (?, ?, ?, ?, ?, ?)
    ''', (
        username,
        hashed_password,
        salt,
        email,
        True,
        privilege
    ))


def seed_users(cursor):
    insert_user(cursor, 'admin', b'admin',
                b'salty_admin', 'admin@gmail.com', 1)
    insert_user(cursor, 'user', b'user', b'salty_user', 'user@gmail.com', 0)


if __name__ == "__main__":
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()

    cleanup(cursor)
    create_tables(cursor)
    seed_cities(cursor)
    seed_users(cursor)

    conn.commit()
    conn.close()
