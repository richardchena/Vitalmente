export default {
    name: 'principal',
    component: () => import(/* webpackChunkName: "auth" */ '@/modules/principal/layouts/InicioLayout.vue'),
    children: [
        {
            path: '',
            name: 'administracion',
            component: () => import(/* webpackChunkName: "Login" */ '@/modules/principal/views/InicioAdministracion'),
        }
    ]
}