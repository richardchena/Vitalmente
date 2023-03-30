export default {
    children: [
        {
            path: '',
            name: 'menu-paciente',
            component: () => import(/* webpackChunkName: "menu-paciente" */ '@/modules/paciente/views/MenuPaciente'),
        },
        {
            path: 'reserva/:id_paciente',
            name: 'reserva-cita-paciente',
            component: () => import(/* webpackChunkName: "reserva-cita-paciente" */ '@/modules/admin/views/ReservaCita')
        },
        {
            path: 'agenda/:id_paciente',
            name: 'agenda-paciente',
            component: () => import(/* webpackChunkName: "agenda-paciente" */ '@/modules/paciente/views/CitasAgendadas')
        },
    ]}