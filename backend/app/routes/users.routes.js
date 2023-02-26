const router = require('express').Router();
const passport = require('passport');
const users = require('../controllers/user.controller');
//const auth = require('../controllers/auth.controller')
const {validar_datos, validar_datos_post} = require('../middlewares/validacion_datos');
const { checkRoles } = require('../middlewares/auth');
const { crear_usuario, usuario_datos, paciente } = require('../schemas/users');
 
//RUTAS DE PACIENTES
router.get('/pacientes',
    passport.authenticate('jwt', {session: false}),
    checkRoles('admin', 'profesional'),
    users.lista_pacientes)

router.post('/pacientes', 
    passport.authenticate('jwt', {session: false}), //VALIDACION DEL TOKEN (USUARIO AUTENTICADO)
    checkRoles('admin'), //VALIDAR SI EL USUARIO LOGEADO CUENTA CON EL ROL CORRECTO PARA ACCEDER A ESTA RUTA
    validar_datos_post(crear_usuario),
    users.crear_paciente);

router.delete('/pacientes/:username',
    passport.authenticate('jwt', {session: false}),
    checkRoles('admin'),
    validar_datos(usuario_datos, 'params'),
    users.eliminar_paciente
);

router.post('/pacientes/cambiar_estado/:id_paciente',
    passport.authenticate('jwt', {session: false}),
    checkRoles('admin'),
    validar_datos(paciente, 'params'),
    users.cambiar_estado_paciente
);

router.delete('/pacientes/eliminar_paciente/:id_paciente',
    passport.authenticate('jwt', {session: false}),
    checkRoles('admin'),
    validar_datos(paciente, 'params'),
    users.baja_paciente
);

//OTRAS RUTAS
router.get('/obtener_datos_usuario',
       passport.authenticate('jwt', {session: false}),
       validar_datos(usuario_datos, 'query'),
       users.obtener_datos_usuario);

module.exports = router;