const router = require('express').Router();
const passport = require('passport');
const mov = require('../controllers/movimiento.controller');
const { checkRoles } = require('../middlewares/auth');

router.get('/movimientos/tipos',
    passport.authenticate('jwt', {session: false}),
    checkRoles('admin'),
    mov.obtener_tipos
);

router.get('/movimientos/categorias',
    passport.authenticate('jwt', {session: false}),
    checkRoles('admin'),
    mov.obtener_categorias
);

router.get('/movimientos',
    passport.authenticate('jwt', {session: false}),
    checkRoles('admin'),
    mov.obtener_movimientos
);

router.post('/movimientos',
    passport.authenticate('jwt', {session: false}),
    checkRoles('admin'),
    mov.reg_movimiento
);

router.delete('/movimientos',
    passport.authenticate('jwt', {session: false}),
    checkRoles('admin'),
    mov.delete_movimiento
);

router.get('/movimientos/distinct/tipos',
    passport.authenticate('jwt', {session: false}),
    checkRoles('admin'),
    mov.distinct_tipo_mov
);

router.get('/movimientos/distinct/categorias',
    passport.authenticate('jwt', {session: false}),
    checkRoles('admin'),
    mov.distinct_cat_mov
);

router.get('/movimientos/saldo',
    passport.authenticate('jwt', {session: false}),
    checkRoles('admin'),
    mov.obtener_saldo
);

router.get('/movimientos/ingreso_egreso',
    passport.authenticate('jwt', {session: false}),
    checkRoles('admin'),
    mov.obtener_ing_eg
);

module.exports = router;