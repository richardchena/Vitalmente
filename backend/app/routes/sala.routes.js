const router = require('express').Router();
const passport = require('passport');
const { checkRoles } = require('../middlewares/auth');
const controller = require('../controllers/sala.controller');

router.get('/sala_espera',
    passport.authenticate('jwt', {session: false}),
    checkRoles('admin'),
    controller.obtener_citas_agendadas
);

router.get('/sala_espera/distinct/profesionales/citas/dia',
    passport.authenticate('jwt', {session: false}),
    checkRoles('admin'),
    controller.distinct_citas_dia
);

router.post('/sala_espera',
    passport.authenticate('jwt', {session: false}),
    checkRoles('admin'),
    controller.insertar_lista
);

router.get('/sala_espera/en_consultorio',
    passport.authenticate('jwt', {session: false}),
    checkRoles('admin'),
    controller.obtener_pacientes_consultorio
);

router.get('/sala_espera/distinct/profesionales/citas/consultorio',
    passport.authenticate('jwt', {session: false}),
    checkRoles('admin'),
    controller.distinct_prof_consultorio
);

router.delete('/sala_espera',
    passport.authenticate('jwt', {session: false}),
    checkRoles('admin'),
    controller.sacar_de_lista
);

router.get('/sala_espera/profesional/atendido',
    passport.authenticate('jwt', {session: false}),
    checkRoles('admin', 'profesional'),
    controller.prof_atendidos
);

router.get('/sala_espera/profesional/espera',
    passport.authenticate('jwt', {session: false}),
    checkRoles('admin', 'profesional'),
    controller.prof_espera
);

router.get('/sala_espera/profesional/verificar_consulta_curso',
    passport.authenticate('jwt', {session: false}),
    checkRoles('admin', 'profesional'),
    controller.prof_verificar_consulta_curso
);

router.get('/sala_espera/profesional/datos_en_curso',
    passport.authenticate('jwt', {session: false}),
    checkRoles('admin', 'profesional'),
    controller.datos_en_curso_prof
);

router.post('/sala_espera/profesional/iniciar_cita',
    passport.authenticate('jwt', {session: false}),
    checkRoles('admin', 'profesional'),
    controller.iniciar_consulta
);

router.post('/sala_espera/profesional/finalizar_cita',
    passport.authenticate('jwt', {session: false}),
    checkRoles('admin', 'profesional'),
    controller.finalizar_consulta
);

module.exports = router;