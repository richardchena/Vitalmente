const router = require('express').Router();
const auth = require('./auth.routes');
const users = require('./users.routes');
const parametros = require('./parametros.routes');

// Rutas sobre el login del sistema
router.use(auth);
router.use(users);
router.use(parametros);

module.exports = router;