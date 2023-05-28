import ListaPacientesVista from '@/modules/admin/views/ListaPacientes'
import RegistroPacienteVista from '@/modules/admin/views/FormularioRegistroPaciente'
import MenuVista from '@/modules/admin/views/Menu'
import ReservaCitaVista from '@/modules/admin/views/ReservaCita'
import HistorialConsultasVista from '@/modules/admin/components/HistorialConsultas'

export default {
    children: [
        {
            path: '',
            name: 'menu-admin',
            component: MenuVista
            //component: () => import(/* webpackChunkName: "menu-admin" */ '@/modules/admin/views/Menu'),
        },
        {
            path: 'registrar_paciente',
            name: 'registrar-paciente-admin',
            component: RegistroPacienteVista
            //component: () => import(/* webpackChunkName: "registrar-paciente-admin" */ '@/modules/admin/views/FormularioRegistroPaciente'),
        },
        {
            path: 'lista_pacientes',
            name: 'lista-pacientes-admin',
            component: ListaPacientesVista
            //component: () => import(/* webpackChunkName: "lista-pacientes-admin" */ '@/modules/admin/views/ListaPacientes'),
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
            component: HistorialConsultasVista
            //component: () => import(/* webpackChunkName: "historial-consultas-admin" */ '@/modules/admin/components/HistorialConsultas'),
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
            component: ReservaCitaVista
            //component: () => import(/* webpackChunkName: "reserva-cita" */ '@/modules/admin/views/ReservaCita')
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
        {
            path: 'citas_agendadas',
            name: 'citas-agendadas-admin',
            component: () => import(/* webpackChunkName: "citas-agendadas-admin" */ '@/modules/admin/views/CitasAgendadesAdmin')
        },
        {
            path: 'caja',
            name: 'caja',
            component: () => import(/* webpackChunkName: "caja" */ '@/modules/admin/views/MovimientoCaja')
        },
        {
            path: 'especialidades',
            name: 'especialidades',
            component: () => import(/* webpackChunkName: "especialidades" */ '@/modules/admin/views/Especialidades')
        },
        {
            path: 'parametros_consultas',
            name: 'parametros-consultas',
            component: () => import(/* webpackChunkName: "parametros_consultas" */ '@/modules/admin/views/ParametrosConsulta')
        },
        {
            path: 'reports',
            name: 'reports',
            component: () => import(/* webpackChunkName: "reports" */ '@/modules/admin/views/Reportes')
        },
        {
            path: 'sala',
            name: 'sala',
            component: () => import(/* webpackChunkName: "sala" */ '@/modules/admin/views/SalaEspera'),
            children: [
                {
                    path: '',
                    name: 'tabla-lista-pacientes-reserva-hoy',
                    component: () => import(/* webpackChunkName: "tabla-lista-pacientes-reserva-hoy" */ '@/modules/admin/components/TablaListaCitasHoy'),
                },
                {
                    path: 'en_espera',
                    name: 'tabla-lista-pacientes-reserva-hoy-en-espera',
                    component: () => import(/* webpackChunkName: "tabla-lista-pacientes-reserva-hoy-en-espera" */ '@/modules/admin/components/TablaEnSalaEspera'),
                },
            ]
        },
    ]
}