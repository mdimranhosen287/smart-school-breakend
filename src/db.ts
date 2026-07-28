import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

let db: any;

try {
  db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'students_care_db',
    port: Number(process.env.DB_PORT) || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
} catch (err) {
  console.warn('[AI Studio] MySQL DB connection pool creation error — using fallback mock');
  db = {
    query: async () => [[], []],
    execute: async () => [[], []],
    getConnection: async () => ({
      query: async () => [[], []],
      execute: async () => [[], []],
      release: () => {},
    }),
  };
}

export default db;
