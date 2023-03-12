<template>
    <div>
        <nav class="navbar" style="background: #c6c6c6">
            <div style="margin-left: 15px; margin-top: 7px; height: 30px">
                <strong>Historial de consultas</strong>
            </div>

            <div class="d-flex flex-row align-items-center justify-content-center">
                <button class="btn btn-outline-danger" style="margin-right: 20px" @click="atras">ATRÁS</button>

                <button class="btn btn-outline-dark" style="margin-right: 20px" @click="registrar_consulta">
                    <i class="fas fa-notes-medical"></i>&nbsp;&nbsp;&nbsp;Nueva consulta
                </button>

                <div class="form-group" style="margin-right: 12px">
                    <input type="text" class="form-control" id="buscador" style="width: 225px" placeholder='&#x1F50E;&#xFE0E; Realiza una búsqueda aquí' v-model="filtro">
                </div>
            </div>
        </nav>
        <div class="contendor_tabla">
            <table class="table table-hover table-cell-border table-stripe" id="tabla">
                <thead>
                    <tr>
                        <th>ID Consulta</th>
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

    export default {
        data: function() {
            return {
                id: this.$route.params.id,
                filtro: null,
                datos: null
            }
        },

        computed:{
            ...mapGetters('auth', ['accessToken']),
        },

        methods:{
            atras(){
                this.$router.push({name: 'lista-pacientes-admin'})
            },

            registrar_consulta(){
                this.$router.push({name: 'registro-consulta', params:{
                    id: this.id
                }})
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
        },

        async mounted(){
            await this.get_lista()
            $(document).ready(function(){
                var tabla = $('#tabla').dataTable({
                    responsive: true,
                    destroy: true,
                    language: {
                        url: "//cdn.datatables.net/plug-ins/1.10.11/i18n/Spanish.json"
                    },
                    fixedColumns: true,
                    pageLength: 10,
                    lengthChange: false,
                    searching: true,
                    searchDelay: 0,
                    dom: 'lrtip',
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