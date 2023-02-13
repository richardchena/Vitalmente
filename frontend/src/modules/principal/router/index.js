export default {
    name: 'principal',
    component: () => import(/* webpackChunkName: "principal" */ '@/modules/principal/layouts/InicioLayout.vue'),
}