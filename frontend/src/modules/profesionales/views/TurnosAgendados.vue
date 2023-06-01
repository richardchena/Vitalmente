<template>
    <div>
        <nav class="navbar" style="background: #c6c6c6">
            <div style="margin-left: 15px; margin-top: 7px; height: 30px">
                <strong>Turnos agendados</strong>
            </div>
            <div style="position: absolute; margin-left: 180px">
                <VueDatePicker 
                    v-model="fecha"
                    placeholder="Ingrese una fecha"
                    locale="es-PY"
                    :enable-time-picker="false"
                    :min-date="new Date()"
                    :disabled-week-days="[0]"
                    :format="formato_fecha"
                    week-start="0"
                    :day-names="dias_semana"
                    select-text="OK"
                    cancel-text="Cancelar"
                    :markers="marcadores"
                    :disabled-dates="dias_desactivados"
                    hide-offset-dates
                    :clearable="false"
                >
                    <template #calendar-header="{  day }">
                        <div v-if="day === 'Do'" class="text-danger">
                            {{ day }}
                        </div>
                        <div v-else>
                            {{ day }}
                        </div>
                    </template>
                </VueDatePicker>
            </div>
            <div style="margin-left: -240px;">
                <button class="btn btn-success " @click="ver_todos">
                    VER TODAS LAS FECHAS
                </button>
            </div>
            <div class="d-flex flex-row align-items-center justify-content-center">
                <div class="d-flex flex-row align-items-center justify-content-center">
                    <div style="margin-right: 10px">
                        <button style="margin-right: 10px" class="btn btn-info text-white" @click="cancelar_hoy">
                            CANCELAR CITAS DEL DÍA
                        </button>
                        <button class="btn btn-danger " @click="regresar_atras">
                            IR A INICIO
                        </button>
                    </div>
                </div>
            </div>
        </nav>
        <div class="container">
            <table class="table table-hover table-cell-border table-striped" id="tabla">
                <thead>
                    <tr>
                        <th>Nro. Reserva</th>
                        <th>Fecha Reserva</th>
                        <th>Paciente</th>
                        <th>Fecha Turno</th>
                        <th>Especialidad</th>
                        <th>Status</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="dato in datos" :key="dato.id_cita" :id="dato.id_cita">
                        <td>{{dato.id_cita}}</td>
                        <td>{{dato.fecha_reserva}}</td>
                        <td>{{dato.paciente}}</td>
                        <td>{{dato.fecha_turno}}</td>
                        <td>{{dato.especialidad}}</td>
                        <td>{{dato.estado_cita}}</td>
                        <th></th>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import authApi from '@/api/authApi'
import VueDatePicker from '@vuepic/vue-datepicker';
import { mapGetters} from 'vuex'
import '@vuepic/vue-datepicker/dist/main.css'

//Bootstrap and jQuery libraries
import 'jquery/dist/jquery.min.js';
//Datatable Modules
import "datatables.net-dt/js/dataTables.dataTables"
import "datatables.net-dt/css/jquery.dataTables.min.css"
import * as $ from 'jquery';
import 'bootstrap';
import Swal  from 'sweetalert2'
import format from 'date-fns/format';

export default {
    components: {
        VueDatePicker
    },

    data(){
        return{
            //fecha: !this.$route.query.fecha ? new Date(): new Date(this.$route.query.fecha),
            fecha: this.$route.query.fecha,
            fecha_fin: null,
            dias_semana: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
            marcadores: [],
            dias_desactivados: [],
            datos: null,
            fecha_filtro: null
        }
    },

    async mounted(){
        await this.obtener_lista();
        const funcion_cancelar = this.cancelar_reserva;

        $(document).ready(function(){
            this.tabla = $('#tabla').dataTable({
                responsive: true,
                destroy: true,
                language: {
                    url: "//cdn.datatables.net/plug-ins/1.10.11/i18n/Spanish.json",
                    emptyTable: "No hay citas agendadas para la fecha seleccionada"
                },
                fixedColumns: true,
                pageLength: 8,
                lengthChange: false,
                searching: true,
                searchDelay: 0,
                order: [[0, 'asc']],
                dom: 'lrtip',
                columns:[
                    {"className": "dt-center", "targets": "_all"},
                    {"className": "dt-center", "targets": "_all"},
                    {"className": "dt-center", "targets": "_all"},
                    {"className": "dt-center", "targets": "_all"},
                    {"className": "dt-center", "targets": "_all"},
                    {"className": "dt-center", "targets": "_all"},
                    {
                        className: "dt-center",
                        title: 'Control',
                        orderable: false,
                        searchable: false,
                        //wrap: true, 
                        render: function (data, type,row) {
                            let cancelar;
                            if(row[5] === 'CANCELADO PROFESIONAL'){
                                cancelar = '<button class="btn btn-info" disabled><i class="fas fa-ban"></i>&nbsp;&nbsp;Cancelar</button>';
                            } else {
                                cancelar = '<button class="btn btn-info text-white cancelar_manual"><i class="fas fa-ban"></i>&nbsp;&nbsp;Cancelar</button>';
                            }
                            return cancelar;
                        }
                    }
                ]
            }).api();

            $(".cancelar_manual").click(function(){
                let index = $(this).parents("tr")[0].id;
                funcion_cancelar(index);
            });
        });
    },

    computed:{
        ...mapGetters('auth', ['accessToken']),
    },

    created(){
        document.title = 'Turnos agendados'
        this.obtener_feriados();
        /*if(!this.$route.query.fecha){
            this.fecha = new Date(this.$route.query.fecha)
        } else {
            this.fecha = new Date()
        }*/
    },

    watch:{
        async fecha(){
            if(this.fecha) {
                this.fecha_filtro = format(this.fecha, 'yyyy/MM/dd')//'dd/MM/yyyy')
                await this.$router.replace({query: { fecha: this.fecha_filtro }})
                this.$router.go(0);
            } else {
                await this.$router.replace({query: { fecha: format(new Date(), 'yyyy/MM/dd') }})
                this.$router.go(0);
            }
        }
    },

    methods: {
        cancelar_hoy(){
            Swal.fire({
            icon: 'question',
            html: `<h4>¿Está seguro que quiere cancelar todas las citas del día de hoy (${format(new Date(), 'dd/MM/yyyy')})?</h4>`,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'OK, cancelar',
            cancelButtonText: 'Atrás'})
            .then((result) => {
                if (result.isConfirmed) {
                    this.cancelar_todas_citas_hoy()
                }
            })
        },

        async cancelar_todas_citas_hoy(){
            authApi.defaults.headers.common['Authorization'] = `Bearer ${this.accessToken}`
            const {data} = await authApi.put('/reservas/agendas/profesional/cancelar_dia_hoy?id_profesional=' + +this.$route.params.id_profesional)

            if(+data.id === 0) {
                Swal.fire({
                    html: `<h4>${data.msg}</h4>`,
                    icon: 'success'
                }).then(() => {
                    this.$router.go();
                })

            } else {
                Swal.fire({
                    html: `<h4>${data.msg}</h4>`,
                    icon: 'error'
                })
            }

        },

        async ver_todos(){
            await this.$router.replace({query: {  }})
            this.$router.go(0);
        },

        async cancelar_reserva(id_cita){
            Swal.fire({
            //title: '<strong>Cancelar reserva</strong>',
            icon: 'question',
            html:'<h4>¿Está seguro que quiere cancelar esta cita?</h4>',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'OK',
            cancelButtonText: 'Atrás'})
            .then((result) => {
                if (result.isConfirmed) {
                    this.cancelar_bd(id_cita)
                }
            })
        },

        async cancelar_bd(id_cita){
            authApi.defaults.headers.common['Authorization'] = `Bearer ${this.accessToken}`
            const obj = {id_cita: id_cita}

            try {
                const {data} = await authApi.put('/reservas/agendas/profesional/cancelar', obj)
                if(data.cod === 0){
                    Swal.fire({
                    html: '<h4>¡Cancelado!</h4>',
                    icon: 'success'}).then(() => { this.$router.go(); });
                } else {
                    Swal.fire({
                    html: '<h4>Error desconocido :(</h4>',
                    icon: 'error'});
                }

            } catch (error) {
                console.log(error)
            }
        },

        async obtener_lista(){
            //let f;

            /*if(!this.$route.query.fecha) {
                f = format(new Date(), 'yyyy/MM/dd')
            } else {
                f = this.$route.query.fecha
            }*/

            let obj = {}
            obj.id_profesional = +this.$route.params.id_profesional
            
            if(this.$route.query.fecha){
                obj.fecha = this.$route.query.fecha
            }

            const {data} = await authApi.get('/reservas/agendas/profesional', {
                params: obj,
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })

            this.datos = data
        },

        regresar_atras(){
            this.$router.push({ path: '/' });
        },

        formato_fecha (date) {

            const day = date.getDate();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();

            return `${day}/${month}/${year}`;
        },

        async obtener_feriados(){
            const {data} = await authApi.get('/obtener_feriados', {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })

            for (let j = 0 ; j < data.length ; j++) {
                let obj =  {};
                obj.date = new Date(data[j].anho,data[j].mes-1,data[j].dia);
                obj.type = 'line';
                obj.tooltip = [{ text: data[j].motivo }]
                
                this.dias_desactivados.push(obj.date);
                this.marcadores.push(obj);
            }
        },
    }
}
</script>