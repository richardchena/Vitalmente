const router = require('express').Router();
const passport = require('passport');
const parametros = require('../controllers/parametros.controller');

router.get('/obtener_paises',
       passport.authenticate('jwt', {session: false}),
       parametros.obtener_paises);

router.get('/obtener_departamentos',
       passport.authenticate('jwt', {session: false}),
       parametros.obtener_departamento);

router.get('/obtener_ciudades',
       passport.authenticate('jwt', {session: false}),
       parametros.obtener_ciudades);

router.get('/obtener_especialidades',
       passport.authenticate('jwt', {session: false}),
       parametros.obtener_especialidades);

router.get('/obtener_feriados',
       passport.authenticate('jwt', {session: false}),
       parametros.obtener_feriados);

router.get('/obtener_tipos_documento',
       passport.authenticate('jwt', {session: false}),
       parametros.obtener_tipo_documento);

module.exports = router;