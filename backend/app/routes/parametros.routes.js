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

router.post('/obtener_especialidades',
       passport.authenticate('jwt', {session: false}),
       parametros.registrar_especialidades);

router.delete('/obtener_especialidades',
       passport.authenticate('jwt', {session: false}),
       parametros.eliminar_especialidades);

router.put('/obtener_especialidades',
       passport.authenticate('jwt', {session: false}),
       parametros.modificar_especialidades);

router.get('/obtener_feriados',
       passport.authenticate('jwt', {session: false}),
       parametros.obtener_feriados);

router.get('/obtener_tipos_documento',
       passport.authenticate('jwt', {session: false}),
       parametros.obtener_tipo_documento);

router.get('/obtener_correo',
       //passport.authenticate('jwt', {session: false}),
       parametros.obtener_correo);

router.get('/obtener_motivos',
       passport.authenticate('jwt', {session: false}),
       parametros.motivos_consultas);

router.post('/obtener_motivos',
       passport.authenticate('jwt', {session: false}),
       parametros.motivos_consultas_insertar);

router.delete('/obtener_motivos',
       passport.authenticate('jwt', {session: false}),
       parametros.motivos_consultas_eliminar);

router.put('/obtener_motivos',
       passport.authenticate('jwt', {session: false}),
       parametros.motivos_consultas_modificar);

router.get('/obtener_diagnosticos',
       passport.authenticate('jwt', {session: false}),
       parametros.diagnosticos_consultas);

router.post('/obtener_diagnosticos',
       passport.authenticate('jwt', {session: false}),
       parametros.diagnosticos_consultas_insertar);

router.delete('/obtener_diagnosticos',
       passport.authenticate('jwt', {session: false}),
       parametros.diagnostico_consultas_eliminar);

router.put('/obtener_diagnosticos',
       passport.authenticate('jwt', {session: false}),
       parametros.diagnostico_consultas_modificar);

router.get('/obtener_nombre_profesional',
       passport.authenticate('jwt', {session: false}),
       parametros.get_name_profesional_by_id);

module.exports = router;