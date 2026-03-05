const express = require('express');
const router = express.Router();
const { sql } = require('../db');

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {

        // 1️⃣ Sanitización básica
        if (!username || !password) {
            return res.status(400).send("Datos inválidos");
        }

        // 2️⃣ Consulta parametrizada
        const request = new sql.Request();
        request.input('username', sql.VarChar, username);
        request.input('password', sql.VarChar, password);

        const result = await request.query(
            "SELECT * FROM users WHERE username = @username AND password = @password"
        );

        if (result.recordset.length > 0) {
            res.send("Login exitoso (SEGURO)");
        } else {
            res.send("Credenciales incorrectas");
        }

    } catch (err) {
        console.error(err);
        res.status(500).send("Error interno del servidor");
    }
});

module.exports = router;