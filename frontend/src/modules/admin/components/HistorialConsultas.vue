<template>
    <div>
        <!--MODAL CONSULTA-->
        <div class="modal fade bd-example-modal-lg" id="my_modal" ref="hola" data-bs-backdrop="static" role="dialog">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">DATOS DE LA CONSULTA #{{id_consulta}}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>

                    <div class="modal-body">
                        <Consulta
                            :id_consulta=+id_consulta
                        />
                    </div>
                </div>
            </div>
        </div>
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#my_modal" ref="boton" style="display: none;">
            boton oculto
        </button>

        <!--PRINCIPAL-->
        <nav class="navbar" style="background: #c6c6c6">
            <div style="margin-left: 15px; margin-top: 7px; height: 30px">
                <strong>Historial de consultas</strong>
            </div>

            <div class="d-flex flex-row align-items-center justify-content-center">
                <button class="btn btn-outline-dark" style="margin-right: 20px" @click="registrar_consulta" v-show="this.role === 2">
                    <i class="fas fa-notes-medical"></i>&nbsp;&nbsp;&nbsp;Nueva consulta
                </button>

                <div class="form-group" style="margin-right: 12px">
                    <input type="text" class="form-control" id="buscador" style="width: 225px" placeholder='&#x1F50E;&#xFE0E; Realiza una búsqueda aquí' v-model="filtro">
                </div>

                <button class="btn btn-danger" style="margin-right: 20px" @click="atras">ATRÁS</button>
            </div>
        </nav>
        <div class="contendor_tabla" style="padding: 20px 100px 0px 100px;">
            <table class="table table-hover table-cell-border table-striped" id="tabla">
                <thead>
                    <tr>
                        <th>Nro. consulta</th>
                        <th>Fecha y hora</th>
                        <th>Profesional</th>
                        <th>Especialidad</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="dato in datos" :key="dato.id">
                        <td>{{dato.id}}</td>
                        <td>{{dato.fecha}}</td>
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

    import {mapGetters} from 'vuex'
    import authApi from '@/api/authApi'
    import 'bootstrap';
    import Swal  from 'sweetalert2'
    import {defineAsyncComponent} from 'vue'

    export default {
        data: function() {
            return {
                id: this.$route.params.id,
                filtro: null,
                datos: null,
                id_consulta: 0
            }
        },

        computed:{
            ...mapGetters('auth', ['accessToken', 'role']),
        },

        components: {
            Consulta: defineAsyncComponent(() => import ('@/modules/admin/components/Consulta'))
        },

        created(){
            document.title = 'Historial de consultas'
        },

        methods:{
            iniciar(){
                if(isNaN(this.$route.params.id)) {
                    Swal.fire({
                    title: 'El ID es inválido',
                    icon: 'error',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK',
                    backdrop: `rgba(128,128,128,0.9)`
                    }).then(() => {
                        this.$router.push({ name: 'lista-pacientes-admin' });
                    })
                }
            },

            atras(){
                //window.location.href = '../lista_pacientes'
                if(this.role === 1) this.$router.push({name: 'lista-pacientes-admin'})
                else this.$router.push({name: 'lista-pacientes-prof'})
            },

            registrar_consulta(){
                /*this.$router.push({name: 'registro-consulta', params:{
                    id: this.id
                }})*/

                if(this.role === 1) {
                    this.$router.push({name: 'datos-historial-consultas-admin', params:{
                        id: this.id
                    }})
                } else {
                    this.$router.push({name: 'datos-historial-consultas-prof', params:{
                        id: this.id, id_esp: 0
                    }})
                }

            },

            async get_lista(){
                const {data} = await authApi.get('/consultas', {
                    params: {
                        id_paciente: this.$route.params.id
                    },
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`
                    }
                })

                this.datos = data
            },

            ver_detalles(id){
                this.id_consulta = id;
                this.$refs.boton.click();
            }
        },
  
        async mounted(){
            this.iniciar()
            await this.get_lista()
            const funcion_ver = this.ver_detalles; 

            $(document).ready(function(){
                var tabla = $('#tabla').dataTable({
                    responsive: true,
                    destroy: true,
                    language: {
                        url: "//cdn.datatables.net/plug-ins/1.10.11/i18n/Spanish.json",
                        emptyTable: "No hay consultas previas del paciente seleccionado"
                    },
                    fixedColumns: true,
                    pageLength: 8,
                    lengthChange: false,
                    searching: true,
                    searchDelay: 0,
                    dom: 'lrtip',
                    order: [],
                    columns:[
                        {a: "id"},
                        {b: "fecha"},
                        {c: "profesional"},
                        {d: "especialidad"},
                        {
                            e: null, 
                            title: 'Controles',
                            orderable: false,
                            searchable: false,
                            //wrap: true, 
                            render: function () {
                                //console.log(data, row, type)
                                let mod;

                                mod = '<button class="btn btn-success boton"><i class="fas fa-file"></i>&nbsp;&nbsp;Ver detalles</button>';
                                
                                return mod;
                            }
                        }
                    ]
                }).api();

                $('#buscador').on('keyup change', function(){
                    tabla.search($(this).val()).draw();
                });

                $(".btn-success").click(function(){
                    funcion_ver($(this).parents("tr").find("td").eq(0).html());
                });
            })
        },
    }
</script>

<style>
    table{
        background-color: #ededed;
        text-align: left;
        width:100%;
        font-family: SF Pro Display sans-serif;
    }

    .contendor_tabla{
        padding: 15px;
    }
</style>