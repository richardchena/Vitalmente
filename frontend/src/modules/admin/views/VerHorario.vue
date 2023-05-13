<template>
    <div>
        <!--<table class="table table-hover table-cell-border table-striped" id="tabla2">
            <thead>
            <tr>
                <th>Día</th>
                <th>Turno mañana</th>
                <th>Turno tarde</th>
                <th>Especialidad</th>
            </tr>
            </thead>
            <tbody>
                <tr v-for="dato in agendas" :key="dato.id_dia">
                    <td>{{dato.dia}}</td>
                    <td >{{dato.turno_man}}</td>
                    <td>{{dato.turno_tar}}</td>
                    <td>{{dato.especialidad}}</td>
                </tr>
            </tbody>
        </table>-->
        <VueGoodTable
            :columns="columns"
            :rows="rows"
            styleClass="vgt-table condensed"
            :pagination-options="{
                enabled: false,
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
                <div class="text-center">No hay datos para mostrar :(</div>
            </template>
        </VueGoodTable>

    </div>
</template>

<script>
    /*import 'jquery/dist/jquery.min.js';
    import "datatables.net-dt/js/dataTables.dataTables"
    import "datatables.net-dt/css/jquery.dataTables.min.css"
    import * as $ from 'jquery';*/

    import { VueGoodTable } from 'vue-good-table-next';
    import 'vue-good-table-next/dist/vue-good-table-next.css'

    import {mapGetters} from 'vuex'
    import authApi from '@/api/authApi'
export default {
    computed:{
        ...mapGetters('auth', ['accessToken']),
    },

    data() {
       return {
            agendas: null,


            columns: [
                {
                    label: 'Día',
                    field: 'dia',
                },
                {
                    label: 'Turno mañana',
                    field: 'turno_man'
                },
                {
                    label: 'Turno tarde',
                    field: 'turno_tar'
                },
                {
                    label: 'Especialidad',
                    field: 'especialidad'
                }
            ],

            rows: [],
       } 
    },

    props: {
        id_agenda: {
            type: Number,
            required: true
        },
    },

    watch: {
        async id_agenda() {
            await this.get_lista();
        }
    },

    /*async mounted() {
        await this.inicio_tabla()
    },*/

    async created(){
        await this.get_lista();
    },

    components: {
        VueGoodTable,
    },

    methods: {
        async get_lista(){
            if(this.id_agenda){
                const {data} = await authApi.get('/profesionales/agenda/dias', {
                    params: {
                        id_agenda: this.id_agenda
                    },
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`
                    }
                })

                this.rows = data
                //this.agendas = data
            }
        },

        /*async inicio_tabla(){
            await this.get_lista();
            $(document).ready(function(){
                $('#tabla2').dataTable({
                    responsive: true,
                    destroy: true,
                    ordering: false,
                    language: {
                        url: "//cdn.datatables.net/plug-ins/1.10.11/i18n/Spanish.json",
                        emptyTable: " "
                    },
                    fixedColumns: true,
                    pageLength: 10,
                    lengthChange: false,
                    searching: true,
                    //searchDelay: 0,
                    dom: '',
                    columnDefs: [
                        {"className": "text-center"},
                        {"className": "text-center"},
                        {"className": "text-center"},
                        {"className": "text-center"}
                    ],
                    columns:[
                        {"className": "dt-center", "targets": "_all"},
                        {"className": "dt-center", "targets": "_all"},
                        {"className": "dt-center", "targets": "_all"},
                        {"className": "dt-center", "targets": "_all"}
                    ]
                }).api();
            });
        }*/
    }
}
</script>

<style scoped>
    .contendor_tabla{
        padding: 20px 100px 0px 100px;
    }
</style>