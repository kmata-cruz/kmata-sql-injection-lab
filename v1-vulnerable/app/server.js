const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { connectDB } = require('./db');
const authRoutes = require('./routes/auth');
require('dotenv').config();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'views')));
app.use('/auth', authRoutes);

connectDB();
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', version: '1.0-vulnerable' });
});

app.get('/', (req, res) => {
    res.redirect('/login.html');
});
app.listen(process.env.PORT, () => {
    console.log(`App vulnerable corriendo en puerto ${process.env.PORT}`);
});