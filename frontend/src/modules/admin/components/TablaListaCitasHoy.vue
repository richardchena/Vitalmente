<template>
    <div>
        <div class="contendor_tabla">
            <div class="d-flex flex-row-reverse" style="margin-bottom: 10px;">
                <div class="form-group">
                    <input type="text" class="form-control" id="buscador_hoy" style="width: 225px" placeholder='&#x1F50E;&#xFE0E; Realiza una búsqueda aquí'>
                </div>
                <select v-model="selectProfesional" class="form-select" style="width: 225px;  margin-right: 15px;" id="selector_prof_hoy">
                    <option 
                        v-for="item in profesionales" 
                        :key="item.id"
                        :value="item.id"
                    >
                        {{item.nombre}}
                    </option>
                </select>
                <strong><label style="margin-top: 7px;">Filtrar Profesional:&nbsp;&nbsp;</label></strong>
            </div>
            <hr>
            <table class="table table-hover table-cell-border table-striped" id="tabla_lista_pacientes">
                <thead>
                    <tr>
                        <th>ID Reserva</th>
                        <th>Nro. Expediente</th>
                        <th>Paciente</th>
                        <th>Tipo Doc.</th>
                        <th>Nro. Doc.</th>
                        <th>Profesional</th>
                        <th>Especialidad</th>
                        <th>Turno</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="dato in reservas" :key="dato.id_cita">
                        <td>{{dato.id_cita}}</td>
                        <td>{{dato.nro_exp}}</td>
                        <td>{{dato.paciente}}</td>
                        <td>{{dato.tipo_doc}}</td>
                        <td>{{dato.nro_doc}}</td>
                        <td>{{dato.profesional}}</td>
                        <td>{{dato.especialidad}}</td>
                        <td>{{dato.horario}}</td>
                        <td></td>
                    </tr>
                
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import 'jquery/dist/jquery.min.js';
import "datatables.net-dt/js/dataTables.dataTables"
import "datatables.net-dt/css/jquery.dataTables.min.css"
import * as $ from 'jquery';
import format from 'date-fns/format';
import authApi from '@/api/authApi'
import { mapGetters} from 'vuex'
import Swal  from 'sweetalert2'

export default {
    async created(){
        document.title = 'Sala de Espera'
        await this.get_distinct_prof()

    },

    computed:{
        ...mapGetters('auth', ['accessToken']),
    },

    data(){
        return{
            //profesionales: [{id:0, nombre: "--TODOS--"}, {id:1, nombre: "Ana Medina"}, {id:2, nombre: "Lorena Francisca"}],
            profesionales: [],
            selectProfesional: 0,
            hoy: format(new Date(), 'dd/MM/yyyy'),
            reservas: null
        }
    },

    methods: {
        confirmar(id_cita, nombre){
            Swal.fire({
                html: `<h4>¿Desea confirmar la asistencia de ${nombre}?</h4>`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.registrar(id_cita)
                }
            })
        },

        async registrar(id){
            authApi.defaults.headers.common['Authorization'] = `Bearer ${this.accessToken}`

            try {
                const {data} = await authApi.post(`/sala_espera?id_cita=${id}`)
                if(data.id === 0){
                    this.$router.go();
                } else {
                    this.error(':(')
                }

            } catch (e) {
                this.error(e)
            }
        },

        error(e){
            Swal.fire({
                html: `<h4>Ocurrio un error inesperado al confirmar la asistencia<br>${e}</h4>`,
                icon: 'error',
            })
        },

        async get_citas(){
            const {data} = await authApi.get('/sala_espera', {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })

            this.reservas = data
        },

        async get_distinct_prof(){
            const {data} = await authApi.get('/sala_espera/distinct/profesionales/citas/dia', {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })

            this.profesionales.push({id:0, nombre: "--TODOS--"})
            for (let i = 0; i < data.length; i++) {
                this.profesionales.push(data[i])
            }
        }
    },

    async mounted(){
        await this.get_citas()
        const funcion_confirmar = this.confirmar;

        $(document).ready(function(){
            let tabla2 = $('#tabla_lista_pacientes').dataTable({
                responsive: true,
                destroy: true,
                language: {
                    url: "//cdn.datatables.net/plug-ins/1.10.11/i18n/Spanish.json",
                    emptyTable: "No hay pacientes con reserva para el día de hoy",
                    /*searchPlaceholder: `🔎 Realiza una búsqueda aquí`, 
                    search: ""*/
                },
                fixedColumns: true,
                pageLength: 7,
                lengthChange: false,
                searching: true,
                searchDelay: 0,
                ordering: false,
                dom: 'lrtip',
                //order: [],
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
                columns:[{"className": "dt-center", "targets": "_all"}, 
                         {"className": "dt-center", "targets": "_all"},
                         {"className": "dt-center", "targets": "_all"},
                         {"className": "dt-center", "targets": "_all"},
                         {"className": "dt-center", "targets": "_all"},
                         {"className": "dt-center", "targets": "_all"},
                         {"className": "dt-center", "targets": "_all"},
                         {"className": "dt-center", "targets": "_all"},
                         {title: 'Controles',
                          className: "dt-center",
                          orderable: false,
                          searchable: false,
                          render: function () {
                            return `
                                <button class="btn btn-success boton"><i class="fas fa-check"></i>&nbsp;&nbsp;Confirmar asistencia</button>`
                            }
                         }]
            }).api();

            $(".btn-success").click(function(){
                funcion_confirmar($(this).parents("tr").find("td").eq(0).html(), $(this).parents("tr").find("td").eq(2).html());
            });

            $('#buscador_hoy').on('keyup change', function(){
                const filtro_prof = $('#selector_prof_hoy').find(":selected").text()

                if (filtro_prof !== '--TODOS--'){
                    tabla2.search(filtro_prof + ' ' + $(this).val()).draw();
                } else {
                    tabla2.search($(this).val()).draw();
                }
            });

            $('#selector_prof_hoy').on('change', function() {
                const valor = $(this).find(":selected").text()

                if (valor !== '--TODOS--'){
                    tabla2.search(valor + ' ' + $('#buscador_hoy').val()).draw();
                } else {
                    tabla2.search(' ' + $('#buscador_hoy').val()).draw();
                }
            });
        })
    }
}
</script>

<style>
    table{
        background-color: #ededed;
        /*text-align: center;*/
        width:100%;
        font-family: SF Pro Display sans-serif;
    }

    .contendor_tabla{
        padding: 15px;
    }

    input[type="checkbox"]{
        margin-top: 0px;
        height: 24px;
        width: 24px;
        border: none;
    }

    input[type="checkbox"]:checked{
        background-color: #198754;
        border: none;
    }

    input[type="checkbox"]:focus{
        box-shadow: none !important;
    }

    .dataTables_wrapper .dataTables_filter input {
        width: 250px;
        height: 40px;
        background: white;
        border-radius: 5px;
    }

    .dataTables_wrapper .dataTables_filter input:focus {
        box-shadow: inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(102,175,233,.6);
        outline: none;
    }
</style>