<template>
    <div>
        <div class="contendor_tabla">
            <div class="d-flex flex-row-reverse" style="margin-bottom: 10px;">
                <div class="form-group">
                    <input type="text" class="form-control" id="buscador_atendidos_prof" style="width: 225px" placeholder='&#x1F50E;&#xFE0E; Realiza una búsqueda aquí'>
                </div>
            </div>

            <table class="table table-hover table-cell-border table-striped" id="atendidos_profesionales">
                <thead>
                    <tr>
                        <th>ID Reserva</th>
                        <th>Cant. Sesiones</th>
                        <th>Paciente</th>
                        <th>Nro. Exp.</th>
                        <th>Tipo Doc.</th>
                        <th>Nro. Doc.</th>
                        <th>Especialidad</th>
                        <th>Turno</th>
                        <th>Horario</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="dato in atendidos" :key="dato.id_cita">
                        <td>{{dato.id_cita}}</td>
                        <td>{{dato.cant_ses}}</td>
                        <td>{{dato.paciente}}</td>
                        <td>{{dato.nro_exp}}</td>
                        <td>{{dato.tipo_doc}}</td>
                        <td>{{dato.nro_doc}}</td>
                        <td>{{dato.especialidad}}</td>
                        <td>{{dato.turno}}</td>
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
import authApi from '@/api/authApi'
import { mapGetters} from 'vuex'

export default {
    computed:{
        ...mapGetters('auth', ['accessToken', 'username']),
    },

    methods: {
        async obtener_id_prof(){
            const {data} = await authApi.get('/profesionales/obtener_id', {
                params: {
                    username: this.username
                },
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })

            this.id_profesional = data.id_profesional
        },

        async obtener_datos_paciente(){
            const {data} = await authApi.get('/sala_espera/profesional/atendido', {
                params: {
                    id_profesional: this.id_profesional
                },
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })

            this.atendidos = data

        },

        funcion_ir_exp(id){
            let win = window.open('./historial_consultas/' + id, '_blank');
            win.focus();
        }
    },

    data(){
        return{
            id_profesional: null,
            atendidos: null,
        }
    },

    created(){
        document.title = 'Pacientes Atendidos'
    },

    async mounted(){
        await this.obtener_id_prof();
        await this.obtener_datos_paciente();

        const funcion_ir_exp = this.funcion_ir_exp;
        $(document).ready(function(){
            let atendidos_prof = $('#atendidos_profesionales').dataTable({
                responsive: true,
                destroy: true,
                language: {
                    url: "//cdn.datatables.net/plug-ins/1.10.11/i18n/Spanish.json",
                    emptyTable: "Aún no se han atendido pacientes el día de hoy",
                },
                fixedColumns: true,
                pageLength: 7,
                lengthChange: false,
                searching: true,
                searchDelay: 0,
                ordering: false,
                dom: 'lrtip',
                columnDefs: [
                        {"className": "text-center"},
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
                         {"className": "dt-center", "targets": "_all"},
                         {title: 'Control',
                          className: "dt-center",
                          orderable: false,
                          searchable: false,
                          render: function () {
                            return `<button class="btn btn-success"><i class="far fa-file-alt"></i>&nbsp;&nbsp;Ir al historial</button>`
                            }
                         }]
            }).api();
        
            $('#buscador_atendidos_prof').on('keyup change', function(){
                atendidos_prof.search($(this).val()).draw();
            });

            $(".btn-success").click(function(){
                funcion_ir_exp($(this).parents("tr").find("td").eq(3).html())
            });
        })
    }
}
</script>

<style>
    .contendor_tabla{
        padding: 15px;
    }
</style>