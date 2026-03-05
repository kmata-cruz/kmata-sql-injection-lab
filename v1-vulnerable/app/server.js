const express = require('express');
const bodyParser = require('body-parser');
const { connectDB } = require('./db');
const authRoutes = require('./routes/auth');
require('dotenv').config();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('app/views'));
app.use('/auth', authRoutes);

connectDB();
app.get('/', (req, res) => {
    res.redirect('/login.html');
});
app.listen(process.env.PORT, () => {
    console.log(`App vulnerable corriendo en puerto ${process.env.PORT}`);
});