const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'musichealth_user',
    password: process.env.DB_PASSWORD || 'musichealth_pass',
    database: process.env.DB_NAME || 'musichealth_db',
});

async function testConnection() {
    try {
        const client = await pool.connect();
        console.log('Успішне підключення до PostgreSQL у Docker-контейнері!');
        const result = await client.query('SELECT NOW() as current_time, version() as pg_version');
        console.log('Поточний час на сервері:', result.rows[0].current_time);
        console.log('Версія PostgreSQL:', result.rows[0].pg_version);
        client.release();
    } catch (err) {
        console.error('Помилка підключення:', err.message);
    } finally {
        await pool.end();
    }
}

testConnection();
