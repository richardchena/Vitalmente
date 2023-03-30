const router = require('express').Router();
const passport = require('passport');
const controller = require('../controllers/reserva.controller');
const {validar_datos} = require('../middlewares/validacion_datos');
const {crear_cita} = require('../schemas/reserva')

router.get('/reservas',
    passport.authenticate('jwt', {session: false}),
    controller.obtener_lista_disponible
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

router.put('/reservas/agendas/paciente/cancelar',
    passport.authenticate('jwt', {session: false}),
    controller.cancelar_cita_paciente
);

module.exports = router;