export default {
    children: [
        {
            path: '',
            name: 'pagos-estados',
            component: () => import(/* webpackChunkName: "pagos-estados" */ '@/modules/pagos/views/Pagos'),
        },
        {
            path: 'nuevo_contribuyente',
            name: 'contribuyente',
            component: () => import(/* webpackChunkName: "contribuyente" */ '@/modules/pagos/views/Contribuyente'),
        },
        {
            path: 'modificar_contribuyente/:id',
            name: 'modificar-contribuyente',
            component: () => import(/* webpackChunkName: "modificar-contribuyente" */ '@/modules/pagos/views/ModificarContribuyente'),
        },
        {
            path: 'contribuyentes',
            name: 'lista-contribuyentes',
            component: () => import(/* webpackChunkName: "lista-contribuyentes" */ '@/modules/pagos/views/ListaContribuyentes'),
        },
        {
            path: 'timbrados',
            name: 'timbrados',
            component: () => import(/* webpackChunkName: "timbrados" */ '@/modules/pagos/views/Timbrados'),
        },
        {
            path: 'nuevo_timbrado',
            name: 'nuevo-timbrado',
            component: () => import(/* webpackChunkName: "nuevo_timbrado" */ '@/modules/pagos/views/NuevoTimbrado'),
        },
        {
            path: 'modificar_timbrado/:id',
            name: 'modificar-timbrado',
            component: () => import(/* webpackChunkName: "modificar-timbrado" */ '@/modules/pagos/views/ModificarTimbrado'),
        },
        {
            path: 'nueva_factura/:id',
            name: 'nueva-factura',
            component: () => import(/* webpackChunkName: "nueva-factura" */ '@/modules/pagos/views/Factura'),
        },
        {
            path: 'consulta_factura/:id',
            name: 'consulta-factura',
            component: () => import(/* webpackChunkName: "consulta-factura" */ '@/modules/pagos/views/VerFactura'),
        },
    ]
}