const express = require('express');
const router = express.Router();
const { sql } = require('../db');

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {

        // VULNERABLE
        const query = "SELECT * FROM users WHERE username = '" 
        + username + 
        "' AND password = '" + password + "'";

        console.log("Query ejecutada:", query);

        const result = await sql.query(query);

        if (result.recordset.length > 0) {
            res.send(" Login exitoso (VULNERABLE)");
        } else {
            res.send(" Credenciales incorrectas");
        }

    } catch (err) {
        console.error(err);
        res.send("Error en la consulta");
    }
});

module.exports = router;