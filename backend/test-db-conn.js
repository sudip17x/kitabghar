import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: 3306
    });
    const [rows] = await conn.query('SELECT VERSION() AS version');
    console.log('✅ Connected! MySQL version:', rows[0].version);
    await conn.end();
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
  }
}

test();
