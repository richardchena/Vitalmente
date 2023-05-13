<template>
    <div>
        <nav class="navbar" style="background: #c6c6c6">
            <div style="margin-left: 15px">
                <strong>Timbrados</strong>
            </div>

            <div class="d-flex flex-row align-items-center justify-content-center">
                <button class="btn btn-outline-dark" style="margin-right: 15px" @click="nuevo_timbrado">
                    <i class="fas fa-plus-circle"></i>&nbsp;&nbsp;&nbsp;Nuevo
                </button>

                <div class="form-group" style="margin-right: 12px">
                    <input type="text" class="form-control" id="buscador" style="width: 225px" placeholder='&#x1F50E;&#xFE0E; Realiza una búsqueda aquí'>
                </div>
            </div>
        </nav>

        <div class="contendor_tabla">
            <table class="table table-hover table-cell-border table-striped" id="timbrados">
                <thead>
                <tr>
                    <th>Contribuyente</th>
                    <th>Número</th>
                    <th>Tipo de Comprobante</th>
                    <th>C.E.</th>
                    <th>P.E.</th>
                    <th>Rango</th>
                    <th>Inicio vigencia</th>
                    <th>Fin vigencia</th>
                    <th>Estado</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="t in timbrados" :key="t.id" :id="t.id">
                    <td>{{t.ruc}}</td>
                    <td>{{t.nro_timbrado}}</td>
                    <td>{{t.tipo_doc}}</td>
                    <td>{{t.est}}</td>
                    <td>{{t.exp}}</td>
                    <td>{{t.rango}}</td>
                    <td>{{t.fecha_desde}}</td>
                    <td>{{t.fecha_hasta}}</td>
                    <td>{{t.estado}}</td>
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
import Swal  from 'sweetalert2'

export default {
    computed:{
        ...mapGetters('auth', ['accessToken'])
    },

    data() {
        return{
            /*timbrados: [{ruc: '80022106-9',
                        nro: 15673870, 
                        tipo: 'FACTURA',
                        ce: '005',
                        pe: '018',
                        rango: '01-1000',
                        inicio: '06/06/2022',
                        fin: '06/06/2023',
                        estado: 'ACTIVO'}]*/
            timbrados: null
        }   
    },

    created() {
        document.title = 'Timbrados'
    },

    methods: {
        nuevo_timbrado(){
            this.$router.push({name: 'nuevo-timbrado'})
        },

        eliminar(nro, id){
            Swal.fire({
            html: `<h4>¿Desea dar de baja el timbrado #${nro}?</h4>`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancelar'})
            .then((result) => {
                if (result.isConfirmed) {
                    this.eliminar_db(id)
                }
            })
        },

        async eliminar_db(id){
            authApi.defaults.headers.common['Authorization'] = `Bearer ${this.accessToken}`

            try {
                const {data} = await authApi.delete(`/pagos/timbrado?id=${id}`)
                if (data.id === 0){
                    this.$router.go();
                } else {
                    Swal.fire({
                    html: "<h4>Hubo un error inesperado</h4>",
                    icon: 'error'})
                }
            } catch (error) {
                Swal.fire({
                html: "<h4>Hubo un error inesperado</h4>",
                icon: 'error'})
            }
        },

        async get_datos(){
            const {data} = await authApi.get('/pagos/timbrado', {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })

            this.timbrados = data
        },

        modificar(id){
            this.$router.push({name: 'modificar-timbrado', params: {id}})
        }
    },

    async mounted(){
        await this.get_datos();
        const eliminar = this.eliminar;
        const modificar = this.modificar;
        $(document).ready(function(){
            let tabla = $('#timbrados').dataTable({
                responsive: true,
                destroy: true,
                language: {
                    url: "//cdn.datatables.net/plug-ins/1.10.11/i18n/Spanish.json"
                },
                fixedColumns: true,
                pageLength: 8,
                lengthChange: false,
                searching: true,
                searchDelay: 0,
                dom: 'lrtip',
                order: [],
                columnDefs: [
                        {"className": "text-center"},
                        {"className": "text-center"},
                        {"className": "text-center"},
                        {"className": "text-center"},
                        {"className": "text-center"},
                        {"className": "text-center"},
                        {"className": "text-center"},
                        {"className": "text-center"},
                        {"className": "text-center"}
                ],
                columns:[
                {"className": "dt-center", "targets": "_all"},
                {"className": "dt-center", "targets": "_all"},
                {"className": "dt-center", "targets": "_all"},
                {"className": "dt-center", "targets": "_all"},
                {"className": "dt-center", "targets": "_all"},
                {"className": "dt-center", "targets": "_all"},
                {"className": "dt-center", "targets": "_all"},
                {"className": "dt-center", "targets": "_all"},
                {"className": "dt-center", "targets": "_all"},
                    {
                        j: null, 
                        title: 'Controles',
                        orderable: false,
                        searchable: false,
                        //wrap: true, 
                        render: function () {
                            return `
                                <button class="btn btn-info boton" title="Modificar registro"><i class="fas fa-pencil-alt"></i></button>
                                <button class="btn btn-danger boton" title="Eliminar"><i class="fas fa-trash-alt"></i></button>
                                `
                        }
                    }
                ]
            }).api();

            $('#buscador').on('keyup change', function(){
                tabla.search($(this).val()).draw();
            });

            $(".btn-danger").click(function(){
                eliminar($(this).parents("tr").find("td").eq(1).html(), $(this).parents("tr")[0].id);
            });

            $(".btn-info").click(function(){
                modificar($(this).parents("tr")[0].id);
            });
        })
    },
}
</script>

<style scoped>
    .contendor_tabla{
        padding: 15px 50px 15px 50px;
    }
</style>