<template>
    <div>
        <!--MODAL MODIFICAR ITEM-->
        <div class="modal fade bd-example-modal-lg" id="modal_vinculo" data-bs-backdrop="static">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Vincular factura</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" ref="cerrar_boton"></button>
                    </div>
                    <div class="modal-body">
                        <label>Número de factura <label style="color: red">*</label></label>
                        <input v-model="nro_factura_vinculo" type="text" class="form-control" placeholder="Ejemplo: 001-001-0000001">
                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-success" @click="vincular">Vincular</button>
                    </div>
                </div>
            </div>
        </div>
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modal_vinculo" ref="boton_vincular" style="display: none;">
            boton oculto
        </button>
        <!--FIN MODAL-->

        <nav class="navbar" style="background: #c6c6c6">
            <div style="margin-left: 15px; margin-top: 7px; height: 30px">
                <strong>Resumen de pagos sobre consultas</strong>
            </div>
            <div class="d-flex flex-row align-items-center justify-content-center">
                <div class="form-group" style="margin-right: 12px">
                    <input type="text" class="form-control" id="buscador" style="width: 225px" placeholder='&#x1F50E;&#xFE0E; Realiza una búsqueda aquí' v-model="filtro">
                </div>

                <div style="margin-right: 10px">
                    <button class="btn btn-danger" @click="inicio">
                        CANCELAR
                    </button>
                </div>
            </div>
        </nav>

        <div class="contendor_tabla">
            <VueGoodTable
                :columns="columns"
                :rows="rows"
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
                    <div class="text-center">No hay datos para mostrar :(</div>
                </template>

                <template #table-row="props">
                    <span v-if="props.column.field == 'controles'">
                        <button v-if="props.row.estado == 'Pendiente'" style="height: 35px;" class="btn btn-info text-white" @click="nueva_factura(props.row.id_cita)"><i class="fas fa-money-check-alt"></i>&nbsp;&nbsp;Finalizar</button>
                        <button v-if="props.row.estado == 'Pendiente'" style="margin-left: 10px; height: 35px;" class="btn btn-primary text-black" @click="vincular_id(props.row.id_especialidad, props.row.id_cita)"><i class="fas fa-link"></i></button>
                        <button v-if="props.row.estado == 'Finalizado'" style="height: 35px;" class="btn btn-secondary" @click="ver_factura(props.row.id_cita)"><i class="fas fa-receipt"></i>&nbsp;&nbsp;Ver Factura</button>
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
import { VueGoodTable } from 'vue-good-table-next';
import 'vue-good-table-next/dist/vue-good-table-next.css'

import Swal  from 'sweetalert2'
import authApi from '@/api/authApi'
import { mapGetters} from 'vuex'

export default {
    data(){
        return{
            filtro: null,
            datos: null,
            nro_factura_vinculo: null,

            id_especialidad_seleccion: null,
            id_cita_seleccion: null,

            //TABLA
            columns: [
                {
                    label: 'Nro. Exp.',
                    field: 'nro_exp',
                },
                {
                    label: 'Paciente',
                    field: 'paciente'
                },
                {
                    label: 'Especialidad',
                    field: 'especialidad'
                },
                {
                    label: 'Fecha Finalización',
                    field: 'fecha'
                },
                {
                    label: 'Total',
                    field: 'total'
                },
                {
                    label: 'Estado',
                    field: 'estado'
                },
                {
                    label: 'Controles',
                    field: 'controles'
                },
            ],

            rows: [],
        }
    },

    components: {
        VueGoodTable,
    },

    computed:{
        ...mapGetters('auth', ['accessToken']),
    },

    methods: {
        inicio(){
            this.$router.push({ path: '/' })
        },

        vincular_id(id_especialidad, id_cita){
            if(!id_especialidad || !id_cita){
                Swal.fire({
                    html: "<h4>Error al intentar vincular</h4>",
                    icon: 'error'
                })
            } else {
                this.id_especialidad_seleccion = id_especialidad
                this.id_cita_seleccion = id_cita

                this.$refs.boton_vincular.click();
            }
        },

        ver_factura(id_cita){
            this.$router.push({ name: 'consulta-factura' , params: {id: id_cita}})
        },

        nueva_factura(id_cita){
            this.$router.push({ name: 'nueva-factura', params: {id: id_cita} })
        },

        async obtener(){
            const {data} = await authApi.get('/facturacion/pendientes', {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })

            this.rows = data
        },

        async vincular(){
            let id_item = this.id_especialidad_seleccion
            let id_cita = this.id_cita_seleccion

            authApi.defaults.headers.common['Authorization'] = `Bearer ${this.accessToken}`

            const {data} = await authApi.post('/facturacion/vincular_factura', {
                nro_factura: this.nro_factura_vinculo,
                id_item,
                id_cita
            })

            console.log(+data.id)
            console.log(!data.id)
            console.log(isNaN(+data.id))

            if(isNaN(+data.id)){
                Swal.fire({
                    html: "<h4>Error al vincular</h4>",
                    icon: 'error'
                }).then(() => {
                    this.nro_factura_vinculo = null
                    this.$refs.cerrar_boton.click();
                })
            }
            else if(+data.id === 0){
                Swal.fire({
                    html: "<h4>Vinculado</h4>",
                    icon: 'success'
                })
                .then(() => {
                    this.$router.go();
                })
            } else if (+data.id === 1){
                Swal.fire({
                    html: "<h4>La factura no contiene el item que desea vincular o no existe</h4>",
                    icon: 'error'
                }).then(() => {
                    this.nro_factura_vinculo = null
                    this.$refs.cerrar_boton.click();
                })
            } else if(+data.id === 2){
                Swal.fire({
                    html: "<h4>La factura ya no puede vincularse con este item.</h4>",
                    icon: 'error'
                }).then(() => {
                    this.nro_factura_vinculo = null
                    this.$refs.cerrar_boton.click();
                })
            } else {
                Swal.fire({
                    html: "<h4>Error inesperado</h4>",
                    icon: 'error'
                }).then(() => {
                    this.nro_factura_vinculo = null
                    this.$refs.cerrar_boton.click();
                })
            }
        },
    },

    async created(){
        document.title = 'Pagos'
        await this.obtener()
        
    },
}
</script>

<style scoped>
    .contendor_tabla{
        padding: 20px 100px 0px 100px;
    }
</style>