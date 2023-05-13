<template>
    <div>
        <div class="contendor_tabla">
            <div class="d-flex flex-row-reverse" style="margin-bottom: 10px;">
                <div class="form-group">
                    <input type="text" class="form-control" id="buscador_espera_prof" style="width: 225px" placeholder='&#x1F50E;&#xFE0E; Realiza una búsqueda aquí'>
                </div>
            </div>

            <table class="table table-hover table-cell-border table-striped" id="espera_profesionales">
                <thead>
                    <tr>
                        <th>Orden</th>
                        <th>Paciente</th>
                        <th>Tipo Doc.</th>
                        <th>Nro. Doc.</th>
                        <th>Especialidad</th>
                        <th>Cant. Sesiones</th>
                        <th>Turno</th>
                        <th>Horario</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="dato in atendidos" :key="dato.id_cita" :id="dato.id_cita">
                        <td>{{dato.orden}}</td>
                        <td>{{dato.paciente}}</td>
                        <td>{{dato.tipo_doc}}</td>
                        <td>{{dato.nro_doc}}</td>
                        <td>{{dato.especialidad}}</td>
                        <td>{{dato.cant_ses}}</td>
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
import Swal  from 'sweetalert2'

export default {
    created(){
        document.title = 'Pacientes en espera'
    },

    data(){
        return{
            id_profesional: null,
            atendidos: null,
            bandera: false,
        }
    },

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

        async verificar_consulta_curso(){
            const {data} = await authApi.get('/sala_espera/profesional/verificar_consulta_curso', {
                params: {
                    id_profesional: this.id_profesional
                },
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })

            if(+data.cantidad === 0){
                this.bandera = true;
            }
        },

        async get_citas(){
            await this.obtener_id_prof();
            if(this.id_profesional){
                const {data} = await authApi.get(`/sala_espera/profesional/espera?id_profesional=${this.id_profesional}`, {
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`
                    }
                })

                this.atendidos = data
            }

        },

        async confirmar_inicio(id){
            authApi.defaults.headers.common['Authorization'] = `Bearer ${this.accessToken}`

            try {
                const {data} = await authApi.post(`/sala_espera/profesional/iniciar_cita?id_cita=${id}`)
                if(data.id === 0) {
                    this.$router.push({name: 'atencion-curso-prof'})
                } else {
                    this.error(':(')
                }

            } catch (error) {
                this.error(error)
            }
        },

        error(er){
            console.log(er)
            Swal.fire({
                html: `<h4>Ha ocurrido un error inesperado</h4>`,
                icon: 'error'
            })
        },

        funcion_iniciar(id){
            if(this.bandera){
                Swal.fire({
                    html: `<h4>¿Desea iniciar esta cita?</h4>`,
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancelar'

                }).then((result) => {
                    if (result.isConfirmed) {
                        this.confirmar_inicio(id);
                    }
                })

            } else {
                Swal.fire({
                    html: `<h4>Favor primero finalice la consulta en curso</h4>`,
                    icon: 'error'
                })
            }

        },
    },

    async mounted(){
        await this.get_citas();
        await this.verificar_consulta_curso();

        const funcion_iniciar = this.funcion_iniciar;
        $(document).ready(function(){
            let espera_prof = $('#espera_profesionales').dataTable({
                responsive: true,
                destroy: true,
                language: {
                    url: "//cdn.datatables.net/plug-ins/1.10.11/i18n/Spanish.json",
                    emptyTable: "No hay pacientes en sala de espera",
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
                         {title: 'Control',
                          className: "dt-center",
                          orderable: false,
                          searchable: false,
                          render: function () {
                            return `<button class="btn btn-success"><i class="fas fa-play"></i>&nbsp;&nbsp;Iniciar atención</button>`
                            }
                         }]
            }).api();
        
            $('#buscador_espera_prof').on('keyup change', function(){
                espera_prof.search($(this).val()).draw();
            });

            $(".btn-success").click(function(){
                let index = $(this).parents("tr")[0].id;
                funcion_iniciar(index);
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