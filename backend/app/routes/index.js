const router = require('express').Router();
const auth = require('./auth.routes');

// Rutas sobre el login del sistema
router.use(auth);

module.exports = router;