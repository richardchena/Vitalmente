<template>
    <div>
        <div class="container">
            <VueGoodTable
                :columns="columns"
                :rows="datos_citas"
                styleClass="vgt-table condensed"
                :pagination-options="{
                    enabled: true,
                    mode: 'pages',
                    perPageDropdownEnabled: false,
                    perPage: 5,
                    nextLabel: 'Siguiente',
                    ofLabel: 'de',
                    pageLabel: 'Pagina',
                    prevLabel: 'Anterior',    
                }"
            >
                <template #emptystate>
                    <div class="text-center">{{msg}}</div>
                </template>

                <template #table-row="props">
                    <span v-if="props.column.field == 'control'">
                        <button class="btn btn-success" @click="reservar(props.row.originalIndex)"><i class="fas fa-plus"></i>&nbsp;&nbsp;Reservar</button>
                    </span>

                    <span v-else>
                        {{props.formattedRow[props.column.field]}}
                    </span>
                </template>
            </VueGoodTable>
        </div>
    </div>
</template>

<script>
import 'bootstrap';
import { mapGetters} from 'vuex'
import authApi from '@/api/authApi'

import Swal  from 'sweetalert2'

import { VueGoodTable } from 'vue-good-table-next';
import 'vue-good-table-next/dist/vue-good-table-next.css'

export default {
    components: {
        VueGoodTable
    },

    props: {
        id_paciente: {
            type: Number,
            required: true
        },
        id_profesional: {
            type: Number,
            required: true
        },
        id_especialidad: {
            type: Number,
            required: true
        },
        id_turno: {
            type: Number,
            required: true
        },

        id_fecha: {}
    },

    /*watch: {
        id_profesional(){
            this.obtener_lista_disponible()
        },

        id_especialidad(){
            this.obtener_lista_disponible()
        },

        id_turno(){
            this.obtener_lista_disponible()
        },

        id_fecha(){
            this.obtener_lista_disponible()
        }
    },*/

    data(){
        return {
            datos_citas: [],
            datos_sin_filtro: [],
            tabla: null,
            msg: null,

            columns: [
                {
                    label: 'Fecha',
                    field: 'fecha'
                },
                {
                    label: 'Día',
                    field: 'dia'
                },
                {
                    label: 'Hora',
                    field: 'hora'
                },
                {
                    label: 'Profesional',
                    field: 'profesional'
                },
                {
                    label: 'Especialidad',
                    field: 'especialidad'
                },
                {
                    label: 'Control',
                    field: 'control',
                    sortable: false,
                },
            ]
        }
    },


    computed:{
        ...mapGetters('auth', ['accessToken']),
        ...mapGetters('auth', ['role']),
        ...mapGetters('auth', ['username']),
    },

    methods: {
        async obtener_lista_disponible(){
            this.datos_citas = []
            this.msg = 'Cargando fechas disponibles... Espere por favor'
            
            const {data} = await authApi.get('/reservas/v2', {
                params: {
                    id_profesional: this.$route.query.id_profesional || 0,
                    id_turno: this.$route.query.id_turno || 0,
                    id_especialidad: this.$route.query.id_especialidad || 0,
                    fecha: this.$route.query.fecha || '0',
                },
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })

            this.datos_citas = data
            this.msg = 'No hay fechas disponibles'
        },

        reservar(id){
            if(this.datos_citas !== undefined){
                let obj = this.datos_citas[id]

                Swal.fire({
                title: '<strong>Confirme la reserva</strong>',
                icon: 'question',
                html:
                    `<strong>Medico:</strong> ${obj.profesional}` + '<br>' +
                    `<strong>Especialidad:</strong> ${obj.especialidad}` + '<br>' +
                    `<strong>Fecha:</strong> ${obj.dia} - ${obj.fecha}` + '<br>' +
                    `<strong>Horario:</strong> ${obj.hora}`,
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Reservar',
                cancelButtonText: 'Cancelar'})
                .then((result) => {
                    if (result.isConfirmed) {
                        this.cargar_reserva(obj);
                    }
                })

            } else {
                Swal.fire({
                html: '<h4>Error desconocido :(</h4>',
                icon: 'error'});
            }
        },

        async obtener_id(){
            const {data} = await authApi.get('/obtener_id_paciente', {
                params: {
                    username: this.username,
                },
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })

            return +data.id_paciente
        },

        async cargar_reserva(obj){
            const id_pac = await this.obtener_id()
            let reserva = {}
            reserva.id_paciente = +this.$route.params.id_paciente
            reserva.id_profesional = obj.id_profesional
            reserva.id_turno = obj.id_turno
            reserva.id_especialidad = obj.id_especialidad
            reserva.fecha = obj.fecha
            reserva.hora = obj.hora

            console.log(reserva)

            authApi.defaults.headers.common['Authorization'] = `Bearer ${this.accessToken}`
            const {data} = await authApi.post('/reservas', reserva);

            if(data.cod === '0') {
                Swal.fire({
                html: '<h4>Error desconocido :(</h4>',
                icon: 'error'});
            } else {
                Swal.fire({
                html: '<h4>Su cita ha sido programada correctamente</h4>',
                icon: 'success'})
                .then(() => {
                    if(this.role === 3) {
                        this.$router.push({name: 'agenda-paciente', params: {id_paciente: id_pac}})
                    } else if (this.role === 2) {
                        this.$router.go(0);
                    }
                    else {
                        this.$router.go(0);
                    }
                    
                })
            }
        }
    },

    async mounted(){
        await this.obtener_lista_disponible();
    },
}
</script>

<style scoped>
    table {
        text-align: center;
        /*background-color: rgba(72, 69, 69, 0.356);*/
        width:100%;
    }
</style>