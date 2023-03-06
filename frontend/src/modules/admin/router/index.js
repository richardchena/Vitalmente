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
        {
            path: 'lista_profesionales',
            name: 'lista-profesionales-admin',
            component: () => import(/* webpackChunkName: "lista-profesionales-admin" */ '@/modules/admin/views/ListaProfesionales'),
        },
        {
            path: 'registrar_profesional',
            name: 'registrar-profesional-admin',
            component: () => import(/* webpackChunkName: "registrar-profesional-admin" */ '@/modules/admin/views/FormularioRegistroProfesional'),
        },
    ]
}