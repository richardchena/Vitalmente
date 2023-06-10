<template>
    <div>
        <nav class="navbar" style="background: #c6c6c6">
            <div style="margin-left: 15px; margin-top: 7px; height: 30px">
                <strong>Turnos agendados</strong>
            </div>
            <div class="d-flex flex-row align-items-center justify-content-center">
                <div class="d-flex flex-row align-items-center justify-content-center">
                    <div style="margin-right: 10px">
                        <button class="btn btn-danger " @click="regresar_atras">
                            IR A INICIO
                        </button>
                    </div>
                </div>
            </div>
        </nav>
        <div class="container" style="margin-top: 10px;">
            <VueGoodTable
                :columns="columns"
                :rows="datos"
                styleClass="vgt-table condensed"
                :pagination-options="{
                    enabled: true,
                    mode: 'pages',
                    perPageDropdownEnabled: false,
                    perPage: 9,
                    nextLabel: 'Siguiente',
                    ofLabel: 'de',
                    pageLabel: 'Pagina',
                    prevLabel: 'Anterior',    
                }"
            >
                <template #emptystate>
                    <div class="text-center">{{texto_tabla}}</div>
                </template>

                <template #table-row="props">
                    <span v-if="props.column.field == 'control'">
                        <button class="btn btn-info" @click="cancelar_reserva(props.row.id_cita)"><i class="fas fa-ban"></i>&nbsp;&nbsp;Cancelar</button>
                    </span>

                    <span v-else>
                        {{props.formattedRow[props.column.field]}}
                    </span>
                </template>
            </VueGoodTable>
        </div>
        
        <div class="container" v-show="false">
            <table class="table table-hover table-cell-border table-striped" id="tabla">
                <thead>
                    <tr>
                        <th>Nro. Reserva</th>
                        <th>Paciente</th>
                        <th>Fecha Reserva</th>
                        <th>Fecha Turno</th>
                        <th>Especialidad</th>
                        <th>Profesional</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="dato in datos" :key="dato.id_cita" :id="dato.id_cita">
                        <td>{{dato.id_cita}}</td>
                        <td>{{dato.paciente}}</td>
                        <td>{{dato.fecha_reserva}}</td>
                        <td>{{dato.fecha_turno}}</td>
                        <td>{{dato.especialidad}}</td>
                        <td>{{dato.profesional}}</td>
                        <th></th>
                    </tr>
                </tbody>
            </table>
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

    data(){
        return {
            datos: [],

            texto_tabla: null,

            columns: [
                {
                    label: 'Nro. Reserva',
                    field: 'id_cita'
                },
                {
                    label: 'Paciente',
                    field: 'paciente'
                },
                {
                    label: 'Fecha Reserva',
                    field: 'fecha_reserva'
                },
                {
                    label: 'Fecha Turno',
                    field: 'fecha_turno'
                },
                {
                    label: 'Especialidad',
                    field: 'especialidad'
                },
                {
                    label: 'Profesional',
                    field: 'profesional'
                },
                {
                    label: 'Control',
                    field: 'control'
                },
            ]
        }
    },

    computed:{
        ...mapGetters('auth', ['accessToken']),
        ...mapGetters('auth', ['username']),
    },

    async created(){
        document.title = 'Turnos agendados paciente'
        await this.validar();
    },

    methods: {
        regresar_atras(){
            this.$router.push({ name: 'menu-paciente' });
        },

        async cancelar_reserva(id_cita){
            Swal.fire({
            //title: '<strong>Cancelar reserva</strong>',
            icon: 'question',
            html:'<h4>¿Está seguro que quiere cancelar esta cita?</h4>',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'OK',
            cancelButtonText: 'Atrás'})
            .then((result) => {
                if (result.isConfirmed) {
                    this.cancelar_bd(id_cita)
                }
            })
        },

        async cancelar_bd(id_cita){
            authApi.defaults.headers.common['Authorization'] = `Bearer ${this.accessToken}`
            const obj = {id_cita: id_cita}

            try {
                const {data} = await authApi.put('/reservas/agendas/paciente/cancelar', obj)
                if(data.cod === 0){
                    Swal.fire({
                    html: '<h4>¡Cancelado!</h4>',
                    icon: 'success'}).then(() => { this.obtener_lista() });
                } else {
                    Swal.fire({
                    html: '<h4>Error desconocido :(</h4>',
                    icon: 'error'});
                }

            } catch (error) {
                console.log(error)
            }
        },

        async validar(){
            const id = await this.obtener_id();
            if(+this.$route.params.id_paciente !== id) {
                Swal.fire({
                title: 'Error en los parámetros de la URL',
                icon: 'error',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK',
                backdrop: `rgba(128,128,128,1)`
                }).then(() => {
                    this.$router.push({ path: '/' });
                })
            }
        },

        async obtener_lista(){
            this.datos = []
            this.texto_tabla = 'Cargando turnos... Espere por favor'
            const {data} = await authApi.get('/reservas/agendas/paciente', {
                params: {
                    id_paciente: +this.$route.params.id_paciente
                },
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })

            this.datos = data
            this.texto_tabla = 'No hay datos para mostrar'
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

    },

    async mounted(){
        await this.obtener_lista();
    }
}
</script>

<style scoped>

</style>