const sql = require('mssql');
require('dotenv').config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER || 'localhost',
    database: process.env.DB_DATABASE,
    port: 1433,
    options: {
        encrypt: false,
        trustServerCertificate: true
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

async function connectDB() {
    try {
        await sql.connect(config);
        console.log("Conectado a kmata_lab_db");
    } catch (err) {
        console.error("Error de conexión:", err);
    }
}

module.exports = { sql, connectDB };