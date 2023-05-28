<template>
    <div>
        <!--MODAL ACTUALIZAR-->
        <div class="modal fade bd-example-modal-lg" id="my_modal" ref="hola" data-bs-backdrop="static" role="dialog">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Modificar motivo</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" ref="close_modificar_motivo"></button>
                    </div>

                    <div class="modal-body">
                        <div class="row">
                            <div class="col">
                                <label for="primer_apellido">Descripción <label style="color: red">*</label></label>
                                <input v-model="motivo_desc_modificar" type="text" class="form-control">
                            </div>
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button class="btn btn-danger" data-bs-dismiss="modal">Cancelar</button>
                        <button class="btn btn-info text-white" @click="modificar_bd">Modificar</button>
                    </div>
                </div>
            </div>
        </div>

        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#my_modal" ref="boton" style="display: none;">
            boton oculto
        </button>
        <!--FIN MODAL-->

        <!--MODAL ACTUALIZAR DIAG-->
        <div class="modal fade bd-example-modal-lg" id="modal_diag" ref="hola" data-bs-backdrop="static" role="dialog">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Modificar diagnóstico</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" ref="close_modificar_diag"></button>
                    </div>

                    <div class="modal-body">
                        <div class="row">
                            <div class="col">
                                <label for="primer_apellido">Descripción <label style="color: red">*</label></label>
                                <input v-model="diagnostico_desc_modificar" type="text" class="form-control">
                            </div>
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button class="btn btn-danger" data-bs-dismiss="modal">Cancelar</button>
                        <button class="btn btn-info text-white" @click="modificar_bd_diag">Modificar</button>
                    </div>
                </div>
            </div>
        </div>

        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modal_diag" ref="boton_diag" style="display: none;">
            boton oculto
        </button>
        <!--FIN MODAL-->

        <nav class="navbar" style="background: #c6c6c6">
            <div style="margin-left: 15px; margin-top: 7px; height: 30px">
                <strong>Configuración de los parámetros de consulta</strong>
            </div>

            <div class="d-flex flex-row align-items-center justify-content-center">
                <button class="btn btn-danger " @click="regresar_atras" style="margin-right: 12px;">
                    IR A INICIO
                </button>
            </div>
        </nav>

        <br>

        <div class="container">
            <div class="row">
                <div class="col">
                    <nav class="navbar" style="background: #7cd175">
                        <div style="margin-left: 15px; margin-top: 7px; height: 30px">
                            <strong>Motivos</strong>
                        </div>

                        <div class="d-flex flex-row align-items-center justify-content-center">
                            <div class="form-group" style="margin-right: 12px">
                                <input type="text" v-model="input_motivo" class="form-control" style="width: 250px" placeholder="Ingrese la descripción del motivo">
                            </div>

                            <button class="btn btn-success" style="margin-right: 20px" @click="agregar_motivo">
                                Agregar
                            </button>
                        </div>
                    </nav>

                    <VueGoodTable
                        :columns="columnas"
                        :rows="datos_motivos"
                        styleClass="vgt-table condensed"
                        :pagination-options="{
                            enabled: true,
                            mode: 'pages',
                            perPageDropdownEnabled: false,
                            perPage: 7,
                            nextLabel: 'Siguiente',
                            ofLabel: 'de',
                            pageLabel: 'Pagina',
                            prevLabel: 'Anterior',    
                        }"
                    >
                        <template #emptystate>
                            <div class="text-center">{{texto_tabla_motivo}}</div>
                        </template>

                        <template #table-row="props">
                            <span v-if="props.column.field == 'controles'">
                                <button class="btn btn-outline-info" @click="modificar_motivo(props.row.id)" style="margin-right: 10px;">
                                    <i class="fas fa-trash-alt"></i>&nbsp;&nbsp;Modificar
                                </button>

                                <button class="btn btn-outline-danger" @click="eliminar_motivo(props.row.id)">
                                    <i class="fas fa-trash-alt"></i>&nbsp;&nbsp;Eliminar
                                </button>
                            </span>

                            <span v-else>
                                {{props.formattedRow[props.column.field]}}
                            </span>
                        </template>

                    </VueGoodTable>
                </div>

                <div class="col">
                    <nav class="navbar" style="background: #7cd175">
                        <div style="margin-left: 15px; margin-top: 7px; height: 30px">
                            <strong>Diagnósticos</strong>
                        </div>

                        <div class="d-flex flex-row align-items-center justify-content-center">
                            <div class="form-group" style="margin-right: 12px">
                                <input type="text" v-model="input_diagnostico" class="form-control" style="width: 280px" placeholder="Ingrese la descripción del diagnóstico">
                            </div>

                            <button class="btn btn-success" style="margin-right: 20px" @click="agregar_diagnostivo">
                                Agregar
                            </button>
                        </div>
                    </nav>

                    <VueGoodTable
                        :columns="columnas"
                        :rows="datos_diagnostivos"
                        styleClass="vgt-table condensed"
                        :pagination-options="{
                            enabled: true,
                            mode: 'pages',
                            perPageDropdownEnabled: false,
                            perPage: 7,
                            nextLabel: 'Siguiente',
                            ofLabel: 'de',
                            pageLabel: 'Pagina',
                            prevLabel: 'Anterior',    
                        }"
                    >
                        <template #emptystate>
                            <div class="text-center">{{texto_tabla_diagnostico}}</div>
                        </template>

                        <template #table-row="props">
                            <span v-if="props.column.field == 'controles'">
                                <button class="btn btn-outline-info" @click="modificar_diagnostico(props.row.id)" style="margin-right: 10px;">
                                    <i class="fas fa-trash-alt"></i>&nbsp;&nbsp;Modificar
                                </button>

                                <button class="btn btn-outline-danger" @click="eliminar_diagnostico(props.row.id)">
                                    <i class="fas fa-trash-alt"></i>&nbsp;&nbsp;Eliminar
                                </button>
                            </span>

                            <span v-else>
                                {{props.formattedRow[props.column.field]}}
                            </span>
                        </template>
                    </VueGoodTable>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Swal  from 'sweetalert2'

import {mapGetters} from 'vuex'
import authApi from '@/api/authApi'

import { VueGoodTable } from 'vue-good-table-next';
import 'vue-good-table-next/dist/vue-good-table-next.css'

export default {
    components: {
        VueGoodTable,
    },

    computed:{
        ...mapGetters('auth', ['accessToken'])
    },

    created(){
        this.get_motivos();
        this.get_diagnosticos();
    },

    data(){
        return {
            input_motivo: null,
            input_diagnostico: null,

            motivo_id_modificar: null,
            motivo_desc_modificar: null,

            diagnostico_id_modificar: null,
            diagnostico_desc_modificar: null,

            texto_tabla_motivo: 'Sin registros',
            texto_tabla_diagnostico: 'Sin registros',

            datos_motivos: [],
            datos_diagnostivos: [],

            columnas: [
                {
                    label: 'Descripción',
                    field: 'descripcion',
                },
                {
                    label: 'Controles',
                    field: 'controles',
                    width: '250px',
                    sortable: false,
                }
            ]
        }
    },

    methods: {
        regresar_atras(){
            this.$router.push({path: '/'})
        },

        async get_motivos(){
            this.datos_motivos = []
            this.texto_tabla_motivo = 'Cargando...'
            await new Promise(resolve => setTimeout(resolve, 1000));

            try {
                const {data} = await authApi.get('/obtener_motivos', {
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`
                    }
                })

                this.datos_motivos = data
            } catch (error) {
                console.log(error)
            }

            this.texto_tabla_motivo = 'Sin registros'
        },

        async get_diagnosticos () {
            this.datos_diagnostivos = []
            this.texto_tabla_diagnostico = 'Cargando...'
            await new Promise(resolve => setTimeout(resolve, 1000));

            try {
                const {data} = await authApi.get('/obtener_diagnosticos', {
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`
                    }
                })

                this.datos_diagnostivos = data
            } catch (error) {
                console.log(error)
            }

            this.texto_tabla_diagnostico = 'Sin registros'
        },

        async agregar_motivo(){
            this.datos_motivos = []

            if(!this.input_motivo){
                Swal.fire({
                    html: `<h4>Debe agregar una descripción del motivo</h4>`,
                    icon: 'warning'
                })
            } else {
                await this.registrar_motivo()
                this.input_motivo = null
            }

            await this.get_motivos()
        },

        async agregar_diagnostivo(){
            this.datos_diagnostivos = []

            if(!this.input_diagnostico){
                Swal.fire({
                    html: `<h4>Debe agregar una descripción del diagnostico</h4>`,
                    icon: 'warning'
                })
            } else {
                await this.registrar_diagnostico()
                this.input_diagnostico = null
            }

            await this.get_diagnosticos()
        },

        async registrar_motivo (){
            authApi.defaults.headers.common['Authorization'] = `Bearer ${this.accessToken}`
            const {data} = await authApi.post(`/obtener_motivos?descripcion=${this.input_motivo}`)
            
            if(+data.id !== 0) {
                Swal.fire({
                    html: `<h4>${data.msg}</h4>`,
                    icon: 'warning'
                })
            }
        },

        async registrar_diagnostico (){
            authApi.defaults.headers.common['Authorization'] = `Bearer ${this.accessToken}`
            const {data} = await authApi.post(`/obtener_diagnosticos?descripcion=${this.input_diagnostico}`)
            
            if(+data.id !== 0) {
                Swal.fire({
                    html: `<h4>${data.msg}</h4>`,
                    icon: 'warning'
                })
            }
        },

        modificar_motivo(id){
            this.motivo_id_modificar = id
            const valor = this.datos_motivos.filter((item) => item.id === +id)
            this.motivo_desc_modificar = valor[0].descripcion

            this.$refs.boton.click()
        },

        modificar_diagnostico(id){
            this.diagnostico_id_modificar = id
            const valor = this.datos_diagnostivos.filter((item) => item.id === +id)
            this.diagnostico_desc_modificar = valor[0].descripcion

            this.$refs.boton_diag.click()
        },

        async modificar_bd(){
            authApi.defaults.headers.common['Authorization'] = `Bearer ${this.accessToken}`
            const {data} = await authApi.put(`/obtener_motivos?id=${this.motivo_id_modificar}&descripcion=${this.motivo_desc_modificar}`)

            if(+data.id !== 0) {
                Swal.fire({
                    html: `<h4>${data.msg}</h4>`,
                    icon: 'error'
                })
            } else {
                Swal.fire({
                    html: `<h4>${data.msg}</h4>`,
                    icon: 'success'
                }).then(() => {
                    this.$refs.close_modificar_motivo.click()
                    this.get_motivos()
                })
            }
        },

        async modificar_bd_diag(){
            authApi.defaults.headers.common['Authorization'] = `Bearer ${this.accessToken}`
            const {data} = await authApi.put(`/obtener_diagnosticos?id=${this.diagnostico_id_modificar}&descripcion=${this.diagnostico_desc_modificar}`)

            if(+data.id !== 0) {
                Swal.fire({
                    html: `<h4>${data.msg}</h4>`,
                    icon: 'error'
                })
            } else {
                Swal.fire({
                    html: `<h4>${data.msg}</h4>`,
                    icon: 'success'
                }).then(() => {
                    this.$refs.close_modificar_diag.click()
                    this.get_diagnosticos()
                })
            }
        },

        async eliminar_motivo(id){
            Swal.fire({
            html: `<h4>¿Desea realmente eliminar este motivo?</h4>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancelar'

            }).then((result) => {
                if (result.isConfirmed) {
                    this.eliminar_bd_motivo(id)
                } 
            })
        },

        async eliminar_bd_motivo (id){
            authApi.defaults.headers.common['Authorization'] = `Bearer ${this.accessToken}`
            const {data} = await authApi.delete(`/obtener_motivos?id=${id}`)

            if(+data.id !== 0) {
                Swal.fire({
                    html: `<h4>${data.msg}</h4>`,
                    icon: 'error'
                })
            } else {
                Swal.fire({
                    html: `<h4>${data.msg}</h4>`,
                    icon: 'success'
                }).then(() => {
                    this.get_motivos()
                })
            }
        },

        async eliminar_diagnostico(id){
            Swal.fire({
            html: `<h4>¿Desea realmente eliminar este diagnostico?</h4>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancelar'

            }).then((result) => {
                if (result.isConfirmed) {
                    this.eliminar_bd_diagnostico(id)
                } 
            })
        },

        async eliminar_bd_diagnostico (id){
            authApi.defaults.headers.common['Authorization'] = `Bearer ${this.accessToken}`
            const {data} = await authApi.delete(`/obtener_diagnosticos?id=${id}`)

            if(+data.id !== 0) {
                Swal.fire({
                    html: `<h4>${data.msg}</h4>`,
                    icon: 'error'
                })
            } else {
                Swal.fire({
                    html: `<h4>${data.msg}</h4>`,
                    icon: 'success'
                }).then(() => {
                    this.get_diagnosticos()
                })
            }
        },
    }
}
</script>