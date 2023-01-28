const router = require('express').Router();
const passport = require('passport');
const users = require('../controllers/user.controller');
const validar_datos = require('../middlewares/validacion_datos');
const { checkRoles } = require('../middlewares/auth');
const { crear_usuario } = require('../schemas/users');
 
router.get('/create_user_paciente', 
    passport.authenticate('jwt', {session: false}), //VALIDACION DEL TOKEN (USUARIO AUTENTICADO)
    checkRoles('admin'), //VALIDAR SI EL USUARIO LOGEADO CUENTA CON EL ROL CORRECTO PARA ACCEDER A ESTA RUTA
    validar_datos(crear_usuario, 'body'), //VALIDAR SI EL BODY RECIBE TODOS LOS PARAMETROS NECESARIOS
    users.crear_admin);

module.exports = router;