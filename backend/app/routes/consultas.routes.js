const router = require('express').Router();
const passport = require('passport');
const consul = require('../controllers/consultas.controller');
const { checkRoles } = require('../middlewares/auth');
const {validar_datos} = require('../middlewares/validacion_datos');
const { consulta, paciente } = require('../schemas/users');

router.get('/consultas',
    passport.authenticate('jwt', {session: false}),
    checkRoles('admin', 'profesional'),
    validar_datos(paciente, 'query'),
    consul.obtener_historial
);

router.post('/consultas',
    passport.authenticate('jwt', {session: false}),
    checkRoles('admin', 'profesional'),
    validar_datos(consulta, 'body'),
    consul.registrar_consulta
);

module.exports = router;