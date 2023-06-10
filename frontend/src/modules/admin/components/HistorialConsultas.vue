<template>
    <div>
        <!--MODAL CONSULTA-->
        <div class="modal fade bd-example-modal-lg" id="my_modal" ref="hola" data-bs-backdrop="static" role="dialog">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">CONSULTA DEL {{fecha_mostrar}}</h5>
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

        <div class="text-center" style="margin-top: 15px; margin-bottom: 0px;" v-show="nombre_paciente">
            <i>Paciente: {{ nombre_paciente }}</i>
        </div>

        <div class="container" style="margin-top: 10px;">
            <VueGoodTable
                :columns="columns"
                :rows="datos"
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
                :search-options="{
                    enabled: false,
                    externalQuery: filtro
                }"
            >
                <template #emptystate>
                    <div class="text-center">{{texto_tabla}}</div>
                </template>

                <template #table-row="props">
                    <span v-if="props.column.field == 'controles'">
                        <button class="btn btn-success boton" @click="ver_detalles(props.row.id, props.row.fecha)"><i class="fas fa-file"></i>&nbsp;&nbsp;Ver detalles</button>
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
    import Swal  from 'sweetalert2'
    import {defineAsyncComponent} from 'vue'

    import { VueGoodTable } from 'vue-good-table-next';
    import 'vue-good-table-next/dist/vue-good-table-next.css'

    export default {
        data: function() {
            return {
                nombre_paciente: null,
                id: this.$route.params.id,
                filtro: null,
                datos: [],
                id_consulta: 0,

                texto_tabla: null,
                fecha_mostrar: null,

                columns: [
                    {
                        label: 'Fecha y hora',
                        field: 'fecha'
                    },
                    {
                        label: 'Profesional',
                        field: 'profesional'
                    },
                    {
                        label: 'Especialidad',
                        field: 'especialidad'
                    },
                    {
                        label: 'Motivo',
                        field: 'tipo_motivo'
                    },
                    {
                        label: 'Diagnóstico',
                        field: 'tipo_diagnostico'
                    },
                    {
                        label: 'Controles',
                        field: 'controles',
                        sortable: false
                    },
                ]
            }
        },

        computed:{
            ...mapGetters('auth', ['accessToken', 'role']),
        },

        components: {
            Consulta: defineAsyncComponent(() => import ('@/modules/admin/components/Consulta')),
            VueGoodTable
        },

        created(){
            document.title = 'Historial de consultas'
            this.obtener_nombre_paciente()
        },

        methods:{
            async obtener_nombre_paciente(){
                const {data} = await authApi.get('/obtener_nombre_paciente?id_paciente=' + this.$route.params.id, {
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`
                    }
                })

                let nombre;

                if(!data){
                    this.nombre_paciente = 'No se puede obtener los datos del paciente :('

                } else {
                    nombre = data.paciente.split(' ').filter((item) => item.length !== 0).join(' ')
                    this.nombre_paciente = nombre
                }
            },

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
                this.texto_tabla = 'Cargando los datos... Por favor espere'
                this.datos = []

                const {data} = await authApi.get('/consultas', {
                    params: {
                        id_paciente: this.$route.params.id
                    },
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`
                    }
                })

                this.datos = data
                this.texto_tabla = 'No hay registros disponibles'
            },

            ver_detalles(id, fecha){
                this.id_consulta = id;
                this.fecha_mostrar = fecha;
                this.$refs.boton.click();
            }
        },
  
        async mounted(){
            this.iniciar()
            await this.get_lista()
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