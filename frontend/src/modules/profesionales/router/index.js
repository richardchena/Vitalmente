export default {
    children: [
        {
            path: '',
            name: 'menu-profesional',
            component: () => import(/* webpackChunkName: "menu-profesional" */ '@/modules/profesionales/views/MenuProfesional'),
        },
        {
            path: 'lista_pacientes',
            name: 'lista-pacientes-prof',
            component: () => import(/* webpackChunkName: "lista-pacientes-prof" */ '@/modules/admin/views/ListaPacientes'),
        },
        {
            path: 'registrar_paciente',
            name: 'registrar-paciente-prof',
            component: () => import(/* webpackChunkName: "registrar-paciente-prof" */ '@/modules/admin/views/FormularioRegistroPaciente'),
        },
        {
            path: 'reserva/:id_paciente',
            name: 'reserva-cita-prof',
            component: () => import(/* webpackChunkName: "reserva-cita-prof" */ '@/modules/admin/views/ReservaCita')
        },
        {
            path: 'gestionar_horario/:id_profesional',
            name: 'gestionar-horario-prof',
            component: () => import(/* webpackChunkName: "gestionar-horario" */ '@/modules/admin/views/GestionHorarios')
        },
        {
            path: 'agenda/:id_profesional',
            name: 'agenda-profesional-prof',
            component: () => import(/* webpackChunkName: "agenda-profesional" */ '@/modules/admin/views/ListaAgenda')
        },
        {
            path: 'registro_consulta',
            name: 'registro-consulta-prof',
            component: () => import(/* webpackChunkName: "registro-consulta-prof" */ '@/modules/admin/views/RegistroConsulta'),
            children: [
                {
                    path: ':id/:id_esp',
                    name: 'datos-historial-consultas-prof',
                    component: () => import(/* webpackChunkName: "datos-historial-consultas-prof" */ '@/modules/admin/components/FormularioConsulta'),
                },
                {
                    path: ':id/:id_esp/historial',
                    name: 'datos-historial-consultas-texto-prof',
                    component: () => import(/* webpackChunkName: "datos-historial-consultas-texto-prof" */ '@/modules/admin/components/HistorialTexto'),
                },
            ]
        },

        {
            path: 'historial_consultas/:id',
            name: 'historial-consultas-prof',
            component: () => import(/* webpackChunkName: "historial-consultas-prof" */ '@/modules/admin/components/HistorialConsultas'),
        },
        {
            path: 'citas_agendadas/:id_profesional',
            name: 'citas-agendadas-prof',
            component: () => import(/* webpackChunkName: "citas-agendadas-prof" */ '@/modules/profesionales/views/TurnosAgendados'),
        },
        {
            path: 'atenciones',
            name: 'atenciones-prof',
            component: () => import(/* webpackChunkName: "atenciones-prof" */ '@/modules/profesionales/views/AtencionDia'),
            children: [
                {
                    path: '',
                    name: 'atencion-atendidos-prof',
                    component: () => import(/* webpackChunkName: "atencion-atendidos-prof" */ '@/modules/profesionales/components/Atendidos'),
                },
                {
                    path: 'curso',
                    name: 'atencion-curso-prof',
                    component: () => import(/* webpackChunkName: "atencion-curso-prof" */ '@/modules/profesionales/components/Curso'),
                },
                {
                    path: 'espera',
                    name: 'atencion-espera-prof',
                    component: () => import(/* webpackChunkName: "atencion-espera-prof" */ '@/modules/profesionales/components/Espera'),
                },
            ]
        },
    ]}