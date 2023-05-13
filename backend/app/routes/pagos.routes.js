const router = require('express').Router();
const passport = require('passport');
const pagos = require('../controllers/pagos.controller');
const { checkRoles } = require('../middlewares/auth');

router.get('/pagos/contribuyente',
    passport.authenticate('jwt', {session: false}),
    checkRoles('admin'),
    //validar_datos(paciente, 'query'),
    pagos.listar_contribuyente
);

router.post('/pagos/contribuyente',
    passport.authenticate('jwt', {session: false}),
    checkRoles('admin'),
    //validar_datos(paciente, 'query'),
    pagos.registrar_contribuyente
);

router.put('/pagos/contribuyente',
    passport.authenticate('jwt', {session: false}),
    checkRoles('admin'),
    //validar_datos(paciente, 'query'),
    pagos.modificar_contribuyente
);


router.delete('/pagos/contribuyente',
    passport.authenticate('jwt', {session: false}),
    checkRoles('admin'),
    //validar_datos(paciente, 'query'),
    pagos.eliminar_contribuyente
);

router.get('/pagos/contribuyente/modificar',
passport.authenticate('jwt', {session: false}),
checkRoles('admin'),
//validar_datos(paciente, 'query'),
pagos.datos_modificar
);

//TIMBRADOS
router.get('/pagos/timbrado',
    passport.authenticate('jwt', {session: false}),
    checkRoles('admin'),
    pagos.lista_timbrados
);

router.post('/pagos/timbrado',
    passport.authenticate('jwt', {session: false}),
    checkRoles('admin'),
    pagos.reg_timbrado
);

router.delete('/pagos/timbrado',
    passport.authenticate('jwt', {session: false}),
    checkRoles('admin'),
    pagos.eliminar_timbrado
);

router.get('/pagos/timbrado/distinct',
    passport.authenticate('jwt', {session: false}),
    checkRoles('admin'),
    pagos.distinct_ruc
);

router.put('/pagos/timbrado',
    passport.authenticate('jwt', {session: false}),
    checkRoles('admin'),
    pagos.modificar_timbrado
);

router.get('/pagos/timbrado/modificar',
passport.authenticate('jwt', {session: false}),
checkRoles('admin'),
//validar_datos(paciente, 'query'),
pagos.datos_modificar_timbrado
);

//FACTURAS
router.get('/factura',
//passport.authenticate('jwt', {session: false}),
//checkRoles('admin'),
pagos.generar_archivo
);

//Datos paciente
router.get('/pagos/datos_cliente',
passport.authenticate('jwt', {session: false}),
checkRoles('admin'),
pagos.datos_cliente
);

router.get('/pagos/datos_cliente/consulta',
passport.authenticate('jwt', {session: false}),
checkRoles('admin'),
pagos.consulta_persona
);

router.post('/pagos/datos_cliente',
passport.authenticate('jwt', {session: false}),
checkRoles('admin'),
pagos.registrar_cliente
);

router.put('/pagos/datos_cliente',
passport.authenticate('jwt', {session: false}),
checkRoles('admin'),
pagos.modificar_cliente
);

module.exports = router;