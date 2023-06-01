const router = require('express').Router();
const passport = require('passport');
const reports = require('../controllers/reports.controller');

router.get('/reports/total_pacientes',
       passport.authenticate('jwt', {session: false}),
       reports.total_pacientes)

router.get('/reports/total_pacientes_genero',
       passport.authenticate('jwt', {session: false}),
       reports.total_cliente_genero)

router.get('/reports/total_pacientes_edades',
       passport.authenticate('jwt', {session: false}),
       reports.total_cliente_edades)

router.get('/reports/total_citas',
       passport.authenticate('jwt', {session: false}),
       reports.total_citas)

router.get('/reports/total_consultas',
       passport.authenticate('jwt', {session: false}),
       reports.total_consultas)

router.get('/reports/especialidades',
       passport.authenticate('jwt', {session: false}),
       reports.especialidades)

router.get('/reports/motivos',
       passport.authenticate('jwt', {session: false}),
       reports.motivos)

router.get('/reports/diagnosticos',
       passport.authenticate('jwt', {session: false}),
       reports.diagnosticos)

router.get('/reports/ingreso_egreso_diario',
       passport.authenticate('jwt', {session: false}),
       reports.ingresos_egresos_diario)
       
module.exports = router;