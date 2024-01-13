import sqlite from 'sqlite3';

const DB_PATH = 'data/db.sqlite3';

export const db = new sqlite.Database(DB_PATH);
