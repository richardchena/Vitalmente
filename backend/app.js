const express = require('express');
const api = require('./app/routes');

const app = express();

app.use(express.json());

// Configuración de la base de datos
const db = require('./app/models')
db.sequelize.sync();

// Definición del passport
require('./app/controllers/passport')

// Definición de ruta principal y sucundarias
app.use('/api/v1', api);

module.exports = app;