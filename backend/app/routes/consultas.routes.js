const router = require('express').Router();
const passport = require('passport');
const consul = require('../controllers/consultas.controller');
const { checkRoles } = require('../middlewares/auth');
const {validar_datos} = require('../middlewares/validacion_datos');
const { consulta, paciente, detalle_consulta, modificar_consulta } = require('../schemas/users');

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

router.get('/consultas/detalles',
    passport.authenticate('jwt', {session: false}),
    checkRoles('admin', 'profesional'),
    validar_datos(detalle_consulta, 'query'),
    consul.obtener_detalle_consulta
);

router.put('/consultas',
    passport.authenticate('jwt', {session: false}),
    checkRoles('admin', 'profesional'),
    validar_datos(modificar_consulta, 'body'),
    consul.modificar_consullta,
);

module.exports = router;