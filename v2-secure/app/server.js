const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { connectDB } = require('./db');
const authRoutes = require('./routes/auth');
require('dotenv').config();

const logger = require('./logger');
const { connectRedis } = require('./cache');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'views')));
app.use('/auth', authRoutes);

connectDB();
connectRedis();
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', version: '2.0-secure' });
});

app.get('/', (req, res) => {
    res.redirect('/login.html');
});
app.listen(process.env.PORT, () => {
    logger.info(`App segura corriendo en puerto ${process.env.PORT}`);
});