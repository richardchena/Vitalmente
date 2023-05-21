const router = require('express').Router();
const passport = require('passport');
const { checkRoles } = require('../middlewares/auth');
const fact = require('../controllers/facturacion.controller');


router.post('/facturacion', 
            passport.authenticate('jwt', {session: false}),
            checkRoles('admin'),
            fact.generar_factura
);

router.post('/facturacion/item', 
            passport.authenticate('jwt', {session: false}),
            checkRoles('admin'),
            fact.agregar_item
);

router.post('/facturacion/emitir', 
            passport.authenticate('jwt', {session: false}),
            checkRoles('admin'),
            fact.emitir
);

router.get('/facturacion/consulta_item', 
            passport.authenticate('jwt', {session: false}),
            checkRoles('admin'),
            fact.consulta_item
);

router.get('/facturacion/obtener_timbrado', 
            passport.authenticate('jwt', {session: false}),
            checkRoles('admin'),
            fact.obtener_timbrado
);

router.get('/facturacion/pendientes', 
            passport.authenticate('jwt', {session: false}),
            checkRoles('admin'),
            fact.obtener_clientes_pendientes_pago
);

router.get('/facturacion/visualizar', 
            passport.authenticate('jwt', {session: false}),
            checkRoles('admin'),
            fact.ver_factura_datos
);

router.delete('/facturacion', 
            passport.authenticate('jwt', {session: false}),
            checkRoles('admin'),
            fact.anular_factura
);

router.post('/facturacion/vincular_factura', 
            passport.authenticate('jwt', {session: false}),
            checkRoles('admin'),
            fact.consulta_vinculo
);

router.get('/facturacion', 
            //passport.authenticate('jwt', {session: false}),
            //checkRoles('admin'),
            fact.generar_pdf_get
);

router.get('/facturacion/prueba',
            passport.authenticate('jwt', {session: false}),
            checkRoles('admin'), 
            fact.correo
);

module.exports = router;