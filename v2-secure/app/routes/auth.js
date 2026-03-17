const express = require('express');
const router = express.Router();
const { sql } = require('../db');
const { client: redis } = require('../cache');
const logger = require('../logger');

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {

        // 1️⃣ Sanitización básica
        if (!username || !password) {
            return res.status(400).send("Datos inválidos");
        }

        // 2️⃣ Consulta parametrizada
        const cacheKey = `login:${username}`;
        
        // Intentar obtener de cache (opcional, solo demo)
        const cachedResult = await redis.get(cacheKey);
        if (cachedResult) {
            logger.info(`Cache hit for ${username}`);
            return res.send("Login exitoso (SEGURO - cached)");
        }

        const request = new sql.Request();
        request.input('username', sql.VarChar, username);
        request.input('password', sql.VarChar, password);

        const result = await request.query(
            "SELECT * FROM users WHERE username = @username AND password = @password"
        );

        if (result.recordset.length > 0) {
            logger.info(`Successful login for ${username}`);
            // Guardar en cache por 60 segundos
            await redis.set(cacheKey, 'success', { EX: 60 });
            res.send("Login exitoso (SEGURO)");
        } else {
            logger.warn(`Failed login attempt for ${username}`);
            res.send("Credenciales incorrectas");
        }

    } catch (err) {
        console.error(err);
        res.status(500).send("Error interno del servidor");
    }
});

module.exports = router;