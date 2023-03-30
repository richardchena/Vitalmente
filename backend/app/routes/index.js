const router = require('express').Router();
const auth = require('./auth.routes');
const users = require('./users.routes');
const parametros = require('./parametros.routes');
const profesionales = require('./profesionales.routes');
const consultas = require('./consultas.routes');
const reservas = require('./reservas.routes');

// Rutas sobre el login del sistema
router.use(auth);
router.use(users);
router.use(parametros);
router.use(profesionales);
router.use(consultas);
router.use(reservas);

module.exports = router;