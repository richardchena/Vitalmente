const router = require('express').Router();
const passport = require('passport');
const docs = require('../controllers/profesionales.controller');
const { checkRoles } = require('../middlewares/auth');
const {validar_datos} = require('../middlewares/validacion_datos');
const { paciente, crear_profesional } = require('../schemas/users');

//RUTAS DE PACIENTES
router.get('/profesionales',
    passport.authenticate('jwt', {session: false}),
    checkRoles('admin'),
    docs.lista_profesionales);

router.post('/profesionales', 
    passport.authenticate('jwt', {session: false}),
    checkRoles('admin'),
    validar_datos(crear_profesional, 'body'),
    docs.registrar_profesional);

router.delete('/profesionales/eliminar_profesional/:id_paciente',
    passport.authenticate('jwt', {session: false}),
    checkRoles('admin'),
    validar_datos(paciente, 'params'),
    docs.baja_profesional
);

router.post('/profesionales/cambiar_estado/:id_paciente',
    passport.authenticate('jwt', {session: false}),
    checkRoles('admin'),
    validar_datos(paciente, 'params'),
    docs.cambiar_estado_profesional
);

module.exports = router;