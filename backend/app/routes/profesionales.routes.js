const router = require('express').Router();
const passport = require('passport');
const docs = require('../controllers/profesionales.controller');
const { checkRoles } = require('../middlewares/auth');
const {validar_datos} = require('../middlewares/validacion_datos');
const { paciente, crear_profesional, modificar_profesional } = require('../schemas/users');

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

router.put('/profesionales',
    passport.authenticate('jwt', {session: false}),
    validar_datos(modificar_profesional, 'body'),
    docs.modificar_profesional);

router.delete('/profesionales/eliminar_profesional/:id_paciente',
    passport.authenticate('jwt', {session: false}),
    checkRoles('admin'),
    validar_datos(paciente, 'params'),
    docs.baja_profesional
);

router.get('/profesionales/datos_paciente_modificar',
    passport.authenticate('jwt', {session: false}),
    validar_datos(paciente, 'query'),
    docs.obtener_datos_para_modificar
);

router.post('/profesionales/cambiar_estado/:id_paciente',
    passport.authenticate('jwt', {session: false}),
    checkRoles('admin'),
    validar_datos(paciente, 'params'),
    docs.cambiar_estado_profesional
);

router.post('/profesionales/agenda',
    passport.authenticate('jwt', {session: false}),
    docs.registrar_agenda
);

router.post('/profesionales/agenda/dias',
    passport.authenticate('jwt', {session: false}),
    docs.registrar_dias_consulta
);

router.get('/profesionales/agenda/lista',
    passport.authenticate('jwt', {session: false}),
    docs.lista_agenda
);

router.get('/profesionales/agenda/dias',
    passport.authenticate('jwt', {session: false}),
    docs.dias
);

router.get('/profesionales/validar/:id_profesional',
    passport.authenticate('jwt', {session: false}),
    docs.validar_id
);

module.exports = router;