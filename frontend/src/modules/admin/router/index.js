export default {
    children: [
        {
            path: '',
            name: 'menu-admin',
            component: () => import(/* webpackChunkName: "menu-admin" */ '@/modules/admin/views/Menu'),
        },
        {
            path: 'registrar_paciente',
            name: 'registrar-paciente-admin',
            component: () => import(/* webpackChunkName: "registrar-paciente-admin" */ '@/modules/admin/views/FormularioRegistroPaciente'),
        },
        {
            path: 'lista_pacientes',
            name: 'lista-pacientes-admin',
            component: () => import(/* webpackChunkName: "lista-pacientes-admin" */ '@/modules/admin/views/ListaPacientes'),
        },
    ]
}