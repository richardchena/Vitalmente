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

        <div class="text-center" style="margin-top: 15px; margin-bottom: -10px;" v-show="nombre_agenda">
            <i>Profesional: {{ nombre_agenda }}</i>
        </div>

        <div class="contendor_tabla">
            <VueGoodTable
                :columns="columns_agenda"
                :rows="agendas"
                styleClass="vgt-table condensed"
                :pagination-options="{
                    enabled: true,
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
                    <div class="text-center">{{texto_tabla}}</div>
                </template>

                <template #table-row="props">
                    <span v-if="props.column.field == 'controles'">
                        <button class="btn btn-secondary boton" @click="ver_detalle(props.row.id, props.row.fecha_desde, props.row.fecha_hasta, props.row.name)"><i class="far fa-file-alt"></i>&nbsp;&nbsp;Ver detalle</button>
                        <button v-if="props.row.cantidad_agenda === 0 && props.row.estado !== 'VENCIDO'" class="btn btn-danger" @click="funcion_eliminar(props.row.id)"><i class="fas fa-trash"></i>&nbsp;&nbsp;Eliminar</button>
                        <button v-else class="btn btn-danger" disabled><i class="fas fa-trash"></i>&nbsp;&nbsp;Eliminar</button>
                    </span>

                    <span v-if="props.column.field == 'estado'">
                        <span v-if="props.row.estado === 'POR VENCER'" style="color: #dc3545">{{props.row.estado}}</span>
                        <span v-else-if="props.row.estado === 'VENCIDO'" style="color: black">{{props.row.estado}}</span>
                        <span v-else style="color: #1d6042">{{props.row.estado}}</span>
                    </span>

                    <span v-else>
                        {{props.formattedRow[props.column.field]}}
                    </span>
                </template>
            </VueGoodTable>
        </div>
    </div>
</template>


<script>
import {mapGetters} from 'vuex'
import authApi from '@/api/authApi'
import 'bootstrap';
import {defineAsyncComponent} from 'vue'
import Swal  from 'sweetalert2'

import { VueGoodTable } from 'vue-good-table-next';
import 'vue-good-table-next/dist/vue-good-table-next.css'

export default {
    components: {
        Horario: defineAsyncComponent(() => import ('@/modules/admin/views/VerHorario')),
        VueGoodTable
    },

    async created() {
        document.title = 'Agendas'
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
            this.texto_tabla = 'Cargando los datos... Por favor espere'
            this.agendas = []

            const {data} = await authApi.get('/profesionales/agenda/lista', {
                params: {
                    id_profesional: this.$route.params.id_profesional
                },
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })

            this.agendas = data
            this.texto_tabla = 'No hay registros disponibles'
        },

        check() {
            this.bandera = 0;
            for (let i = 0; i < this.agendas.length; i++) {
                if(this.agendas[i].estado === 'VIGENTE') {
                    this.bandera = 1
                }
            }
        },

        async obtener_nombre_profesional(){
            const {data} = await authApi.get('/obtener_nombre_profesional?id_profesional=' + this.$route.params.id_profesional, {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })

            this.nombre_agenda = 'Cargando información...'
            let nombre;

            if(!data){
                this.nombre_agenda = 'No se puede obtener los datos del profesional :('

            } else {
                nombre = data.profesional.split(' ').filter((item) => item.length !== 0).join(' ')
                this.nombre_agenda = nombre
            }
        },

        funcion_eliminar(id){
            Swal.fire({
                html: `<h4>¿Desea eliminar esta agenda #${id}?</h4>`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Confirmar',
                cancelButtonText: 'Cancelar'
            })
                .then((result) => {
                    if (result.isConfirmed) {
                        this.eliminar_bd_agenda(id);
                    }
                })

        },

        async eliminar_bd_agenda(id){
            authApi.defaults.headers.common['Authorization'] = `Bearer ${this.accessToken}`
            const {data} = await authApi.delete(`/profesionales/eliminar_agenda?id_agenda=${id}`)

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

        async inicio() {
            await this.get_lista();
        }
    },

    computed:{
        ...mapGetters('auth', ['accessToken']),
        ...mapGetters('auth', ['role']),
    },

    data() {
        return {
            nombre_agenda: null,
            agendas: [],
            id_agenda_select: 0,
            fecha_desde_select: null,
            fecha_hasta_select: null,
            prof_selec: null,
            bandera: null,
            texto_tabla: null,
            columns_agenda: [
                /*{
                    label: 'ID',
                    field: 'id'
                },*/
                {
                    label: 'Profesional',
                    field: 'name'
                },
                {
                    label: 'Fecha Inicio',
                    field: 'fecha_desde'
                },
                {
                    label: 'Fecha Fin',
                    field: 'fecha_hasta'
                },
                {
                    label: 'Cant. Reservas',
                    field: 'cantidad_agenda'
                },
                {
                    label: 'Estado',
                    field: 'estado'
                },
                {
                    label: 'Controles',
                    field: 'controles',
                    sortable: false,
                }
            ]
        }
    },

    async mounted(){
        this.obtener_nombre_profesional()
        this.inicio()
    }
}
</script>

<style scoped>
    .contendor_tabla{
        padding: 20px 100px 0px 100px;
    }
</style>