<template>
    <div>
        <nav class="navbar" style="background: #c6c6c6">
            <div style="margin-left: 15px; margin-top: 7px; height: 30px">
                <strong>Rangos de fechas habilitadas</strong>
            </div>

            <div class="d-flex flex-row align-items-center justify-content-center">
                <div style="margin-right: 10px">
                    <button class="btn btn-outline-dark" style="margin-right: 20px" @click="nuevo_horario">
                        <i class="fas fa-calendar-plus"></i>&nbsp;&nbsp;&nbsp;Nuevas fechas
                    </button>

                    <button class="btn btn-danger " @click="regresar_atras">
                        CANCELAR
                    </button>
                </div>
            </div>
        </nav>

        <div class="contendor_tabla">
            <table class="table table-hover table-cell-border table-striped" id="tabla">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Profesional</th>
                    <th>Fecha inicio</th>
                    <th>Fecha fin</th>
                    <th>Estado</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="dato in agendas" :key="dato.id">
                    <td>{{dato.id}}</td>
                    <td>{{dato.name}}</td>
                    <td>{{new Date((dato.fecha_desde)).toLocaleDateString('es-PY')}}</td>
                    <td>{{(new Date(dato.fecha_hasta)).toLocaleDateString('es-PY')}}</td>
                    <td>{{dato.estado}}</td>
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

import {mapGetters} from 'vuex'
import authApi from '@/api/authApi'
import 'bootstrap';

export default {
    methods: {
        regresar_atras(){
            this.$router.push({name: 'lista-profesionales-admin'})
        },

        nuevo_horario(){
            const id_prof = this.$route.params.id_profesional
            this.$router.push({name: 'gestionar-horario', params: {id_profesional: id_prof}})
        },

        async get_lista(){
            const {data} = await authApi.get('/profesionales/agenda/lista', {
                params: {
                    id_profesional: this.$route.params.id_profesional
                },
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })

            this.agendas = data
        },
    },

    computed:{
        ...mapGetters('auth', ['accessToken']),
    },

    data() {
        return {
            agendas: null
        }
    },

    async created(){
        
    },

    async mounted(){
        await this.get_lista();
        const funcion_ver_detalle = this.ver_detalle;

        $(document).ready(function(){
            $('#tabla').dataTable({
                responsive: true,
                destroy: true,
                language: {
                    url: "//cdn.datatables.net/plug-ins/1.10.11/i18n/Spanish.json",
                    emptyTable: "Aún no se han cargado fechas de consultas"
                },
                fixedColumns: true,
                pageLength: 10,
                lengthChange: false,
                searching: true,
                searchDelay: 0,
                dom: 'lrtip',
                columns:[
                    {a: "id"},
                    {c: "name"},
                    {d: "nro_doc"},
                    {e: "name"},
                    {e: "edad"},
                    {
                        j: null, 
                        title: 'Controles',
                        orderable: false,
                        searchable: false,
                        //wrap: true, 
                        render: function () {
                            let file = '<button class="btn btn-secondary boton"><i class="far fa-file-alt"></i>&nbsp;&nbsp;Ver detalle horario</button>';
                            return file;
                        }
                    }
                ]
            }).api();

            $(".btn-secondary").click(function(){
                funcion_ver_detalle($(this).parents("tr").find("td").eq(0).html());
            });
        })
    }
}
</script>

<style scoped>
    .contendor_tabla{
        padding: 20px 100px 0px 100px;
    }
</style>