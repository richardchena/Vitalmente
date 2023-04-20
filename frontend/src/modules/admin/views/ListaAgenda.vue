<template>
    <div>
        <!--MODAL ACTUALIZAR-->
        <div class="modal fade bd-example-modal-lg" id="my_modal" ref="hola" data-bs-backdrop="static" role="dialog">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">#{{id_agenda_select}} Desde {{fecha_desde_select}} hasta el {{fecha_hasta_select}} - {{prof_selec}}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>

                    <div class="modal-body">
                        <Horario
                            :id_agenda=+id_agenda_select
                        >
                        </Horario>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cerrar</button> 
                    </div>
                </div>
            </div>
        </div>
        
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#my_modal" ref="boton" style="display: none;">
            boton oculto
        </button>
        <!--FIN MODAL-->

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
                    <td>{{dato.fecha_desde}}</td>
                    <td>{{dato.fecha_hasta}}</td>
                    <td v-if="dato.estado === 'POR VENCER'" style="color: #dc3545">{{dato.estado}}</td>
                    <td v-else-if="dato.estado === 'VENCIDO'" style="color: black">{{dato.estado}}</td>
                    <td v-else style="color: #1d6042">{{dato.estado}}</td>
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
import {defineAsyncComponent} from 'vue'
import Swal  from 'sweetalert2'

export default {
    components: {
        Horario: defineAsyncComponent(() => import ('@/modules/admin/views/VerHorario'))
    },

    methods: {
        regresar_atras(){
            if(this.role === 1) {
                this.$router.push({ name: 'lista-profesionales-admin' })
            } else {
                this.$router.push({ name: 'menu-profesional' })
            }
            
        },

        nuevo_horario(){
            this.check();

            if(this.bandera !== 1) {
                const id_prof = this.$route.params.id_profesional
                

                if(this.role === 1) {
                    this.$router.push({name: 'gestionar-horario', params: {id_profesional: id_prof}})
                } else {
                    this.$router.push({name: 'gestionar-horario-prof', params: {id_profesional: id_prof}})
                }

            } else {
                Swal.fire({
                html: '<h4>Aún existen fechas vigentes</h4>',
                icon: 'error'});
            }

        },

        ver_detalle(id, desde, hasta, prof){
            this.id_agenda_select = +id;
            this.fecha_desde_select = desde
            this.fecha_hasta_select = hasta
            this.prof_selec = prof

            this.$refs.boton.click();
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

        check() {
            this.bandera = 0;
            for (let i = 0; i < this.agendas.length; i++) {
                if(this.agendas[i].estado === 'VIGENTE') {
                    this.bandera = 1
                }
            }
        },

        async inicio() {
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
                    ordering: false,
                    //searching: true,
                    //searchDelay: 0,
                    dom: 'lrtip',
                    columns:[
                        {a: "id", orderable: false},
                        {c: "name", orderable: false},
                        {d: "nro_doc", orderable: false},
                        {e: "name", orderable: false},
                        {e: "edad", orderable: false},
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
                    funcion_ver_detalle($(this).parents("tr").find("td").eq(0).html(),
                                        $(this).parents("tr").find("td").eq(2).html(),
                                        $(this).parents("tr").find("td").eq(3).html(),
                                        $(this).parents("tr").find("td").eq(1).html());
                });
            })
        }
    },

    computed:{
        ...mapGetters('auth', ['accessToken']),
        ...mapGetters('auth', ['role']),
    },

    data() {
        return {
            agendas: null,
            id_agenda_select: 0,
            fecha_desde_select: null,
            fecha_hasta_select: null,
            prof_selec: null,
            bandera: null
        }
    },

    async mounted(){
        this.inicio()
    }
}
</script>

<style scoped>
    .contendor_tabla{
        padding: 20px 100px 0px 100px;
    }
</style>