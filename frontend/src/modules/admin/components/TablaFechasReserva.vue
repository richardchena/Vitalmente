<template>
    <div>
        <div class="container">
            <table class="table table-hover table-cell-border table-striped" id="tabla">
                <thead>
                    <tr>
                        <th>Orden</th>
                        <th>Fecha</th>
                        <th>Día</th>
                        <th>Hora</th>
                        <th>Profesional</th>
                        <th>Especialidad</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(dato, index) in datos_citas" :key="index" :id="index">
                        <td>{{index + 1}}</td>
                        <td>{{dato.fecha}}</td>
                        <td>{{dato.dia}}</td>
                        <td>{{dato.hora}}</td>
                        <td>{{dato.profesional}}</td>
                        <td>{{dato.especialidad}}</td>
                        <th></th>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
//Bootstrap and jQuery libraries
import 'jquery/dist/jquery.min.js';
//Datatable Modules
import "datatables.net-dt/js/dataTables.dataTables"
import "datatables.net-dt/css/jquery.dataTables.min.css"
import * as $ from 'jquery';
import 'bootstrap';
import { mapGetters} from 'vuex'
import authApi from '@/api/authApi'

import Swal  from 'sweetalert2'

export default {
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
        id_fecha: {
            type: String,
            required: true
        }
    },

    data(){
        return {
            datos_citas: [],
            datos_sin_filtro: [],
            tabla: null,
            //query_id_profesional: this.$route.query.id_profesional
        }
    },

    /*watch: {
        query_id_profesional() {
            console.log('sdvkjsndv')
            this.$router.reload()
        }
    },*/

    computed:{
        ...mapGetters('auth', ['accessToken']),
        ...mapGetters('auth', ['role']),
        ...mapGetters('auth', ['username']),
    },

    methods: {
        async obtener_lista_disponible(){
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
                    } else {
                        this.$router.go(0);
                    }
                    
                })
            }
        }
    },

    async mounted(){
        await this.obtener_lista_disponible();
        const funcion_reserva = this.reservar;

        $(document).ready(function(){
            this.tabla = $('#tabla').dataTable({
                responsive: true,
                destroy: true,
                language: {
                    url: "//cdn.datatables.net/plug-ins/1.10.11/i18n/Spanish.json",
                    emptyTable: "No hay fechas disponibles para los filtros aplicados"
                },
                fixedColumns: true,
                pageLength: 5,
                lengthChange: false,
                searching: true,
                searchDelay: 0,
                order: [[0, 'asc']],
                dom: 'lrtip',
                columns:[
                    {"className": "dt-center", "targets": "_all"},
                    {"className": "dt-center", "targets": "_all"},
                    {"className": "dt-center", "targets": "_all"},
                    {"className": "dt-center", "targets": "_all"},
                    {"className": "dt-center", "targets": "_all"},
                    {"className": "dt-center", "targets": "_all"},
                    {
                        className: "dt-center",
                        title: 'Control',
                        orderable: false,
                        searchable: false,
                        //wrap: true, 
                        render: function () {
                            let reservar;

                            reservar = '<button class="btn btn-success boton"><i class="fas fa-plus"></i>&nbsp;&nbsp;Reservar</button>';

                            return reservar;
                        }
                    }
                ]
            }).api();

            $(".btn-success").click(function(){
                let index = $(this).parents("tr")[0].id;
                funcion_reserva(index);
            });

        })
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