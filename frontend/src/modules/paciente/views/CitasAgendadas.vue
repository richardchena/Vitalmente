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
    <div>
        <div class="container">
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
                    <tr v-for="dato in datos" :key="dato.id_cita">
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
    data(){
        return {
            datos: null,
        }
    },

    computed:{
        ...mapGetters('auth', ['accessToken']),
        ...mapGetters('auth', ['username']),
    },

    async created(){
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
                    icon: 'success'}).then(() => { this.$router.go(); });
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
            const {data} = await authApi.get('/reservas/agendas/paciente', {
                params: {
                    id_paciente: +this.$route.params.id_paciente
                },
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })

            this.datos = data
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
        const funcion_cancelar = this.cancelar_reserva;

        $(document).ready(function(){
            this.tabla = $('#tabla').dataTable({
                responsive: true,
                destroy: true,
                language: {
                    url: "//cdn.datatables.net/plug-ins/1.10.11/i18n/Spanish.json",
                    emptyTable: "No tiene turnos agendados"
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
                            let cancelar;

                            cancelar = '<button class="btn btn-info boton"><i class="fas fa-ban"></i>&nbsp;&nbsp;Cancelar</button>';

                            return cancelar;
                        }
                    }
                ]
            }).api();

            $(".btn-info").click(function(){
                let index = $(this).parents("tr")[0].__vnode.key;
                funcion_cancelar(index);
            });
        });
    }
}
</script>

<style scoped>

</style>