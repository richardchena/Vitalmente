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
        {
            path: 'historial_consultas/:id',
            name: 'historial-consultas-admin',
            component: () => import(/* webpackChunkName: "historial-consultas-admin" */ '@/modules/admin/components/HistorialConsultas'),
        },
        {
            path: 'registro_consulta',
            name: 'registro-consulta',
            component: () => import(/* webpackChunkName: "registro-consulta" */ '@/modules/admin/views/RegistroConsulta'),
            children: [
                {
                    path: ':id',
                    name: 'datos-historial-consultas-admin',
                    component: () => import(/* webpackChunkName: "datos-historial-consultas-admin" */ '@/modules/admin/components/FormularioConsulta'),
                },
                {
                    path: ':id/historial',
                    name: 'datos-historial-consultas-texto-admin',
                    component: () => import(/* webpackChunkName: "datos-historial-consultas-texto-admin" */ '@/modules/admin/components/HistorialTexto'),
                },
            ]
        },
        {
            path: 'reserva/:id_paciente',
            name: 'reserva-cita',
            component: () => import(/* webpackChunkName: "reserva-cita" */ '@/modules/admin/views/ReservaCita')
        },
        {
            path: 'gestionar_horario/:id_profesional',
            name: 'gestionar-horario',
            component: () => import(/* webpackChunkName: "gestionar-horario" */ '@/modules/admin/views/GestionHorarios')
        },
        {
            path: 'agenda/:id_profesional',
            name: 'agenda-profesional',
            component: () => import(/* webpackChunkName: "agenda-profesional" */ '@/modules/admin/views/ListaAgenda')
        },
    ]
}