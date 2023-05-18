const router = require('express').Router();
const passport = require('passport');
const controller = require('../controllers/reserva.controller');
const {validar_datos} = require('../middlewares/validacion_datos');
const {crear_cita} = require('../schemas/reserva')

router.get('/reservas',
    passport.authenticate('jwt', {session: false}),
    controller.obtener_lista_disponible
);

router.get('/reservas/v2',
    passport.authenticate('jwt', {session: false}),
    controller.obtener_lista_disponible_v2
);

router.get('/reservas/v2/distinct',
    passport.authenticate('jwt', {session: false}),
    controller.distinct_reserva_v2
);

router.get('/reservas/v2/distinct/fecha',
    passport.authenticate('jwt', {session: false}),
    controller.distinct_fecha_v2
);

router.get('/reservas/distinct',
    passport.authenticate('jwt', {session: false}),
    controller.distinct_reserva
);

router.get('/reservas/distinct/fecha',
    passport.authenticate('jwt', {session: false}),
    controller.distinct_fecha
);

router.post('/reservas',
    passport.authenticate('jwt', {session: false}),
    validar_datos(crear_cita, 'body'),
    controller.registrar_reserva
);

//
router.get('/reservas/agendas/paciente',
    passport.authenticate('jwt', {session: false}),
    controller.obtener_citas_agendadas
);

router.get('/reservas/agendas/profesional',
    passport.authenticate('jwt', {session: false}),
    controller.obtener_citas_agendadas_prof
);

router.get('/reservas/agendas/admin',
    passport.authenticate('jwt', {session: false}),
    controller.obtener_citas_agendadas_admin
);

router.get('/reservas/agendas/admin/distinct',
    passport.authenticate('jwt', {session: false}),
    controller.distinct_profs_admin
);

router.put('/reservas/agendas/profesional/cancelar',
    passport.authenticate('jwt', {session: false}),
    controller.cancelar_cita_prof
);

router.put('/reservas/agendas/paciente/cancelar',
    passport.authenticate('jwt', {session: false}),
    controller.cancelar_cita_paciente
);

module.exports = router;