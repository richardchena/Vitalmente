const router = require('express').Router();
const auth = require('./auth.routes');
const users = require('./users.routes');

// Rutas sobre el login del sistema
router.use(auth);
router.use(users);

module.exports = router;