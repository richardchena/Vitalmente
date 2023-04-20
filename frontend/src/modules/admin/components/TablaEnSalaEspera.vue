<template>
    <div>
        <div class="contendor_tabla">
            <div class="d-flex flex-row-reverse" style="margin-bottom: 10px;">
                <div class="form-group">
                    <input type="text" class="form-control" id="buscador_espera" style="width: 225px" placeholder='&#x1F50E;&#xFE0E; Realiza una búsqueda aquí'>
                </div>
                <select v-model="selectProfesional" class="form-select" style="width: 225px;  margin-right: 15px;" id="selector_prof">
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
            <table class="table table-hover table-cell-border table-striped" id="tabla_lista_pacientes_en_espera">
                <thead>
                    <tr>
                        <th>Orden Nro.</th>
                        <th>ID Reserva</th>
                        <th>Paciente</th>
                        <th>Tipo Doc.</th>
                        <th>Nro. Doc.</th>
                        <th>Profesional</th>
                        <th>Especialidad</th>
                        <th>Turno</th>
                        <th>Estado</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="dato in en_espera" :key="dato.id_cita">
                        <td>{{dato.orden}}</td>
                        <td>{{dato.id_cita}}</td>
                        <td>{{dato.paciente}}</td>
                        <td>{{dato.tipo_doc}}</td>
                        <td>{{dato.nro_doc}}</td>
                        <td>{{dato.profesional}}</td>
                        <td>{{dato.especialidad}}</td>
                        <td>{{dato.horario}}</td>
                        <td style="width: 140px;">
                            <div v-if="dato.estado === 'SIENDO ATENDIDO'" class="siendo_atendido">{{dato.estado[0].toUpperCase() + dato.estado.substring(1).toLowerCase()}}</div>
                            <div v-else-if="dato.estado === 'FINALIZADO'" class="finalizado">{{dato.estado[0].toUpperCase() + dato.estado.substring(1).toLowerCase()}}</div>
                            <div v-else class="esperando">{{dato.estado[0].toUpperCase() + dato.estado.substring(1).toLowerCase()}}</div>
                        </td>
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
import Swal  from 'sweetalert2'
import authApi from '@/api/authApi'
import { mapGetters} from 'vuex'

export default {
    computed:{
        ...mapGetters('auth', ['accessToken']),
    },

    data() {
        return{
            profesionales: [],
            selectProfesional: 0,
            en_espera: null
        }
    },

    async created(){
        //document.title = '';
        await this.get_distinct_prof()
    },

    methods:{
        eliminar(id, estado){
            const primera_parte = estado.substr(estado.search('"') + 1)
            const ultima_parte = primera_parte.search('"')
            const resp = primera_parte.substr(0, ultima_parte)

            if(resp === 'esperando') {
                Swal.fire({
                    html: `<h4>¿Desea retirar de la cola de espera la <br>reserva nro. ${id}?</h4>`,
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        this.sacar(id)
                    }
                })
            } else {
                Swal.fire({
                    html: `<h4>Esta opción ya no se puede modificar</h4>`,
                    icon: 'warning',
                })
            }
        },

        async sacar(id){
            authApi.defaults.headers.common['Authorization'] = `Bearer ${this.accessToken}`

            try {
                const {data} = await authApi.delete(`/sala_espera?id_cita=${id}`)
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
            const {data} = await authApi.get('/sala_espera/en_consultorio', {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })

            this.en_espera = data
        },

        async get_distinct_prof(){
            const {data} = await authApi.get('/sala_espera/distinct/profesionales/citas/consultorio', {
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
        await this.get_citas();
        const funcion_eliminar = this.eliminar
        $(document).ready(function(){
            let tabla = $('#tabla_lista_pacientes_en_espera').dataTable({
                responsive: true,
                destroy: true,
                language: {
                    url: "//cdn.datatables.net/plug-ins/1.10.11/i18n/Spanish.json",
                    emptyTable: "No hay pacientes actualmente en sala de espera",
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
                         {//title: 'Controles',
                          className: "dt-center",
                          orderable: false,
                          searchable: false,
                          render: function () {
                            return `<button class="btn btn-engranaje"><i class="fas fa-cog fa-lg"></i></button>`
                            }
                         }]
            }).api();

            $('#buscador_espera').on('keyup change', function(){
                const filtro_prof = $('#selector_prof').find(":selected").text()

                if (filtro_prof !== '--TODOS--'){
                    tabla.search(filtro_prof + ' ' + $(this).val()).draw();
                } else {
                    tabla.search($(this).val()).draw();
                }
            });

            $('#selector_prof').on('change', function() {
                const valor = $(this).find(":selected").text()

                if (valor !== '--TODOS--'){
                    tabla.search(valor + ' ' + $('#buscador_espera').val()).draw();
                } else {
                    tabla.search(' ' + $('#buscador_espera').val()).draw();
                }
            });

            $(".btn-engranaje").click(function(){
                funcion_eliminar($(this).parents("tr").find("td").eq(1).html(), $(this).parents("tr").find("td").eq(8).html());
            });
        })
    }
}
</script>

<style>
    .contendor_tabla{
        padding: 15px;
    }

    .esperando{
        background-color: #393939;
        color: white;
        border-radius: 10px;
        font-weight: bold;
    }

    .finalizado{
        background-color: #318443;
        color: white;
        border-radius: 10px;
        font-weight: bold;
    }

    .siendo_atendido{
        background-color: #F89404;
        color: white;
        border-radius: 10px;
        font-weight: bold;
    }
</style>