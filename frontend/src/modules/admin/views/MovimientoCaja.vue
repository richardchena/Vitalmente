<template>
    <div>
        <!--MODAL COMENTARIO-->
        <div class="modal fade bd-example-modal-lg" id="comentario_modal" data-bs-backdrop="static" role="dialog">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Comentario #{{ id_click }}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <textarea v-model="comentario_click" rows="3" class="form-control" placeholder="No se ha registrado un comentario" style="resize: none;" disabled></textarea>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#comentario_modal" ref="boton_comentario_modal" style="display: none;">
            boton oculto
        </button>
        <!--FIN MODAL-->

        <!--MODAL REG MOV-->
        <div class="modal fade bd-example-modal-lg" id="reg_mov" data-bs-backdrop="static" role="dialog">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Registrar movimiento</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-sm-4">
                                <label style="margin-top: 5px;">Monto operación <label style="color: red">*</label></label>
                            </div>
                            <div class="col">
                                <input v-model="monto" type="number" class="form-control">
                            </div>
                        </div>
                        <br>
                        <div class="row">
                            <div class="col-sm-4">
                                <label style="margin-top: 5px;">Tipo transacción <label style="color: red">*</label></label>
                            </div>
                            <div class="col">
                                <select v-model="selectTipo" class="form-select">
                                    <option 
                                        v-for="item in tipos_mov" 
                                        :key="item.id"
                                        :value="item.id"
                                    >
                                        {{item.descripcion}}
                                    </option>
                                </select>
                            </div>
                        </div>
                        <br>
                        <div class="row">
                            <div class="col-sm-4">
                                <label style="margin-top: 5px;">Medio de pago <label style="color: red">*</label></label>
                            </div>
                            <div class="col">
                                <select class="form-select">
                                    <option selected>Efectivo</option>
                                </select>
                            </div>
                        </div>
                        <br>
                        <div class="row">
                            <div class="col-sm-4">
                                <label style="margin-top: 5px;">Categoria <label style="color: red">*</label></label>
                            </div>
                            <div class="col">
                                <select v-model="selectCat" class="form-select">
                                    <option 
                                        v-for="item in tipos_categ" 
                                        :key="item.id"
                                        :value="item.id"
                                    >
                                        {{item.descripcion}}
                                    </option>
                                </select>
                            </div>
                        </div>
                        <br>
                        <div class="row">
                            <div class="col-sm-4">
                                <label style="margin-top: 5px;">Número factura</label>
                            </div>
                            <div class="col">
                                <input v-model="nro_factura_reg" type="text" class="form-control">
                            </div>
                        </div>
                        <br>
                        <div class="row">
                            <div class="col-sm-4">
                                <label style="margin-top: 5px;">Comentario</label>
                            </div>
                            <div class="col">
                                <textarea v-model="comentario" class="form-control" rows="3" placeholder="Ingrese una justificación del movimiento"></textarea>
                                <div class="text-end">
                                    <label style="margin-top: 5px; font-size: 12px;">{{comentario.length || 0}}/150</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-secondary" @click="registrar">Registrar</button>
                    </div>
                </div>
            </div>
        </div>
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#reg_mov" ref="boton_registro_mov" style="display: none;">
            boton oculto
        </button>
        <!--FIN MODAL-->

        <nav class="navbar" style="background: #c6c6c6">
            <div style="margin-left: 15px; margin-top: 7px; height: 30px">
                <strong>Movimiento de caja</strong>
            </div>

            <div class="row posicionar">
                <div class="col" style="margin-left: 10px; width: 250px;">
                    <VueDatePicker 
                        v-model="fecha"
                        locale="es-PY"
                        :enable-time-picker="false"
                        :max-date="new Date()"
                        week-start="0"
                        :format="formato_fecha"
                        :day-names="dias_semana"
                        select-text="OK"
                        cancel-text="Cancelar"
                        hide-offset-dates
                        :clearable="false"
                        required 
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

                <div class="col" style="width: 250px; margin-left: -15px;">
                    <VueDatePicker 
                        v-model="fecha_hasta"
                        locale="es-PY"
                        :enable-time-picker="false"
                        :max-date="new Date()"
                        week-start="0"
                        :format="formato_fecha"
                        :day-names="dias_semana"
                        select-text="OK"
                        cancel-text="Cancelar"
                        hide-offset-dates
                        :clearable="false"
                        required 
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

                <div class="col" style="margin-left: -15px;">
                    <button class="btn btn-success" @click="seleccionar_fecha">
                        <i class="far fa-calendar-check"></i>&nbsp;&nbsp;SELECCIONAR
                    </button>
                </div>

                <div class="col" style="margin-left: -25px;" >
                    <button class="btn btn-warning" @click="restablecer">
                        <i class="fas fa-undo-alt"></i>
                    </button>
                </div>
            </div>

            <div class="d-flex flex-row align-items-center justify-content-center">
                <div class="d-flex flex-row align-items-center justify-content-center">
                    <div style="margin-right: 10px">
                        <button class="btn btn-secondary" style="margin-right: 10px;" @click="ventana_reg">
                            <i class="fas fa-plus"></i>&nbsp;&nbsp;NUEVO MOVIMIENTO
                        </button>
                    </div>
                </div>
            </div>
        </nav>

        <div class="container" style="margin-top: 15px; margin-bottom: 10px;">
            <div class="row" style="border: solid 1px; padding: 0px; border-radius: 10px; margin-bottom: 15px; background-color: #c6c6c661;">
                <div class="col-sm-2">
                    <select v-model="select_tipo_dist" class="form-select" style="margin-top: 8px;">
                        <option 
                            v-for="item in tipos_movimientos" 
                            :key="item.id"
                            :value="item.id"
                        >
                            {{item.tipo}}
                        </option>
                    </select>
                </div>

                <div class="col-sm-2">
                    <select v-model="select_cat_dist" class="form-select" style="margin-top: 8px;">
                        <option 
                            v-for="item in categoria_movimientos" 
                            :key="item.id"
                            :value="item.id"
                        >
                            {{item.categoria}}
                        </option>
                    </select>
                </div>

                <div class="col-sm-2">
                    <select v-model="select_form_dist" class="form-select" style="margin-top: 8px;">
                        <option value=0>-- FORMA PAGO --</option>
                        <option value=1>Efectivo</option>
                    </select>
                </div>
                
                <div class="col">
                    <div>
                        <label><strong>Ingreso</strong></label><br>
                        <label style="font-size: 20px;"><strong style="color: rgb(2, 162, 69)">{{ separador(ingresos, 1)}}</strong></label>
                    </div>
                </div>

                <div class="col">
                    <div>
                        <label><strong>Egreso</strong></label><br>
                        <label style="font-size: 20px;"><strong style="color: rgb(162, 18, 2)">{{ separador(egresos, 2)}}</strong></label>
                    </div>
                </div>

                <div class="col">
                    <div>
                        <label><strong>Saldo actual</strong></label><br>
                        <label style="font-size: 20px;"><strong style="color: black">{{ separador_general(saldo_actual)}}</strong></label>
                    </div>
                </div>
            </div>
        </div>

        <div class="container">
            <VueGoodTable
                :columns="columns"
                :rows="datos"
                styleClass="vgt-table condensed"
                :pagination-options="{
                    enabled: true,
                    mode: 'pages',
                    perPageDropdownEnabled: false,
                    perPage: 4,
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
                            <button class="btn btn-success" style="margin-right: 2px" @click="ver_comentario(props.row.id)">
                                    <i class="fas fa-comment"></i>
                            </button>

                            <button class="btn btn-danger" @click="eliminar(props.row.id)">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </span>

                        <span v-if="props.column.field == 'importe'">
                            <span>{{separador_general(props.row.importe)}}</span> 
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
import Swal  from 'sweetalert2'

import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

import { VueGoodTable } from 'vue-good-table-next';
import 'vue-good-table-next/dist/vue-good-table-next.css'

import startOfMonth from 'date-fns/startOfMonth';
import format from 'date-fns/format';

export default {
    computed:{
        ...mapGetters('auth', ['accessToken']),
    },

    components: {
        VueDatePicker,
        VueGoodTable,
    },

    async created(){
        document.title = 'Movimiento de caja'

        //Para el modal
        await this.get_lista_tipos()
        await this.get_lista_categorias()

        //Otros
        await this.init()
    },

    watch: {
        async selectTipo(){
            await this.get_lista_categorias()

            if(this.selectTipo === 1){
                this.selectCat = 3
            } else {
                this.selectCat = 4
            }
            
        },

        async fecha(){
            const obj = {
                fecha_desde: format(this.fecha, 'yyyy-MM-dd'),
                fecha_hasta: this.$route.query.fecha_hasta,
                tipo: this.$route.query.tipo,
                categ: this.$route.query.categ,
                forma: this.$route.query.forma
            }

            await this.$router.replace({query: obj})
        },

        async fecha_hasta(){
            const obj = {
                fecha_desde: this.$route.query.fecha_desde,
                fecha_hasta: format(this.fecha_hasta, 'yyyy-MM-dd'),
                tipo: this.$route.query.tipo,
                categ: this.$route.query.categ,
                forma: this.$route.query.forma
            }

            await this.$router.replace({query: obj})
        },

        async select_tipo_dist(){
            const obj = {
                fecha_desde: this.$route.query.fecha_desde,
                fecha_hasta: this.$route.query.fecha_hasta,
                tipo: this.select_tipo_dist,
                categ: this.$route.query.categ,
                forma: this.$route.query.forma
            }

            await this.$router.replace({query: obj})
            await this.init()
        },

        async select_cat_dist(){
            const obj = {
                fecha_desde: this.$route.query.fecha_desde,
                fecha_hasta: this.$route.query.fecha_hasta,
                tipo: this.$route.query.tipo,
                categ: this.select_cat_dist,
                forma: this.$route.query.forma
            }

            await this.$router.replace({query: obj})
            await this.init()
        },

        async select_form_dist(){
            const obj = {
                fecha_desde: this.$route.query.fecha_desde,
                fecha_hasta: this.$route.query.fecha_hasta,
                tipo: this.$route.query.tipo,
                categ: this.$route.query.categ,
                forma: this.select_form_dist
            }

            await this.$router.replace({query: obj})
            await this.init()
        }
    },

    data(){
        return{
            texto_tabla: null,

            ingresos: 0,
            egresos: 0,
            saldo_actual: 0,

            tipos_movimientos: null,
            select_tipo_dist: +this.$route.query.tipo || 0,

            categoria_movimientos: null,
            select_cat_dist: +this.$route.query.categ || 0,

            select_form_dist: +this.$route.query.forma || 0,
            
            dias_semana: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],

            fecha: this.set_fecha_format(this.$route.query.fecha_desde) || startOfMonth(new Date()),
            fecha_hasta: this.set_fecha_format(this.$route.query.fecha_hasta) || new Date(),

            tipos_mov: null,
            selectTipo: 1,

            tipos_categ: null,
            selectCat: 3,

            monto: null,
            nro_factura_reg: '',

            comentario: '',
            id_click: null,
            comentario_click: '',

            datos: [],


            columns: [
                {
                    label: 'Fecha y hora',
                    field: 'fecha'
                },
                {
                    label: 'Monto',
                    field: 'importe'
                },
                {
                    label: 'Tipo',
                    field: 'tipo'
                },
                {
                    label: 'Forma',
                    field: 'forma'
                },
                {
                    label: 'Concepto',
                    field: 'concepto'
                },
                {
                    label: 'Nro. Factura',
                    field: 'nro_factura'
                },
                {
                    label: 'Controles',
                    field: 'controles',
                    sortable: false,
                }
            ]
        }
    },

    methods: {
        async init(){
            this.datos = []

            this.categoria_movimientos = [{id: 0, categoria: '--  CATEGORIA --'}],
            this.tipos_movimientos = [{id: 0, tipo: '-- TIPO MOV. --'}],

            await this.get_dist_tipos_mov() 
            await this.get_dist_cats_mov()

            this.select_tipo_dist = +this.$route.query.tipo || 0
            this.select_cat_dist = +this.$route.query.categ || 0
            this.select_form_dist = +this.$route.query.forma || 0

            this.ingresos = 0
            this.egresos = 0
            this.saldo_actual = 0

            this.texto_tabla = 'Cargando... Por favor espere'

            //AWAIT PROMISE
            await this.get_mov()
            await this.get_saldo()
            await this.get_ingreso_egreso()

            const obj = {
                    fecha_desde: this.$route.query.fecha_desde || format(this.fecha, 'yyyy-MM-dd'),
                    fecha_hasta: this.$route.query.fecha_hasta || format(this.fecha_hasta, 'yyyy-MM-dd'),
                    tipo: this.$route.query.tipo || 0,
                    categ: this.$route.query.categ || 0,
                    forma: this.$route.query.forma || 0
            }
            
            await this.$router.replace({query: obj})
            this.texto_tabla = 'No hay movimientos registrados :('
        },

        async restablecer(){
            const obj = {
                fecha_desde: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
                fecha_hasta: format(new Date(), 'yyyy-MM-dd'),
                tipo: 0,
                categ: 0,
                forma: 0
            }
            
            await this.$router.replace({query: obj})
            await this.init()
        },

        set_fecha_format(fecha){
            try {
                //yyyy-mm-dd
                let array = fecha.split("-");
                let new_f = new Date(+array[0], +array[1] - 1, +array[2]);

                return new_f

            } catch (error) {
                //console.log(error)
                return null
            }
        },

        async seleccionar_fecha(){
            if (this.fecha > this.fecha_hasta){
                Swal.fire({
                    html: '<h4>Las fecha inicio debe ser menor a la fecha hasta</h4>',
                    icon: 'error'
                })
            } else {
                await this.init()
            }
        },


        formato_fecha (date) {

            const day = date.getDate();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();

            return `${day}/${month}/${year}`;
        },

        regresar_atras(){
            this.$router.push('/')
        },

        async get_ingreso_egreso(){
            const {data} = await authApi.get('/movimientos/ingreso_egreso', {
                params: {
                    id_tipo: +this.$route.query.tipo || 0,
                    id_categoria: +this.$route.query.categ || 0,
                    desde: this.$route.query.fecha_desde || format(startOfMonth(new Date()), 'yyyy-MM-dd'),
                    hasta: this.$route.query.fecha_hasta || format(new Date(), 'yyyy-MM-dd'),
                },
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })

            for (let i = 0; i < data.length; i++) {
                if(+data[i].id_tipo_mov === 1){
                    this.ingresos = data[i].total
                } 

                if(+data[i].id_tipo_mov === 2){
                    this.egresos = data[i].total
                }
            }
        },

        ver_comentario(id){
            this.id_click = id
            this.comentario_click = this.datos.find(x => x.id === +id).comentario;
            this.$refs.boton_comentario_modal.click();
        },

        ventana_reg(){
            this.$refs.boton_registro_mov.click();
        },

        async get_lista_tipos(){
            const {data} = await authApi.get('/movimientos/tipos', {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })

            this.tipos_mov = data
        },
        
        async get_dist_tipos_mov(){
            const {data} = await authApi.get('/movimientos/distinct/tipos', {
                params: {
                    id_tipo: +this.$route.query.tipo || 0,
                    id_categoria: +this.$route.query.categ || 0,
                    desde: this.$route.query.fecha_desde || format(startOfMonth(new Date()), 'yyyy-MM-dd'),
                    hasta: this.$route.query.fecha_hasta || format(new Date(), 'yyyy-MM-dd'),
                },
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })

            for (let i = 0; i < data.length; i++) {
                this.tipos_movimientos.push(data[i])
            }
        },

        async get_saldo(){
            const {data} = await authApi.get('/movimientos/saldo', {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })

            this.saldo_actual = +data
        },

        async get_dist_cats_mov(){
            const {data} = await authApi.get('/movimientos/distinct/categorias', {
                params: {
                    id_tipo: +this.$route.query.tipo || 0,
                    id_categoria: +this.$route.query.categ || 0,
                    desde: this.$route.query.fecha_desde || format(startOfMonth(new Date()), 'yyyy-MM-dd'),
                    hasta: this.$route.query.fecha_hasta || format(new Date(), 'yyyy-MM-dd'),
                },
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })

            for (let i = 0; i < data.length; i++) {
                this.categoria_movimientos.push(data[i])
            }
        },

        async get_mov(){
            await new Promise(resolve => setTimeout(resolve, 1000)); 
            //TODO: ELIMINAR DESPUES EN PRODUCCION

            const {data} = await authApi.get('/movimientos', {
                params: {
                    id_tipo: +this.$route.query.tipo || 0,
                    id_categoria: +this.$route.query.categ || 0,
                    desde: this.$route.query.fecha_desde || format(startOfMonth(new Date()), 'yyyy-MM-dd'),
                    hasta: this.$route.query.fecha_hasta || format(new Date(), 'yyyy-MM-dd'),
                },
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })

            this.datos = data
        },

        async get_lista_categorias(){
            const {data} = await authApi.get(`/movimientos/categorias?cod=${this.selectTipo}`, {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })

            this.tipos_categ = data
        },

        registrar(){
            if(this.verificar()){
                this.reg_bd()
            } else {
                Swal.fire({
                    html: '<h4>Favor completar los campos requeridos</h4>',
                    icon: 'error'
                })
            }
        },

        async reg_bd(){
            authApi.defaults.headers.common['Authorization'] = `Bearer ${this.accessToken}`

            let obj = {
                monto: this.monto,
                tipo: this.selectTipo,
                categoria: this.selectCat,
                nro_factura: this.nro_factura_reg,
                comentario: this.comentario
            }

            try {
                const {data} = await authApi.post(`/movimientos`, obj)
                if(data.id === 0) {
                    Swal.fire({
                        html: '<h4>Movimiento registrado</h4>',
                        icon: 'success'
                    }).then(() => { this.$router.go() })

                } else {
                    Swal.fire({
                        html: '<h4>Error al insertar el registro</h4>',
                        icon: 'error'
                    })
                }

            } catch (error) {
                console.log(error)
                Swal.fire({
                    html: '<h4>Error al conectar con la base de datos</h4>',
                    icon: 'error'
                })
            }
        },

        verificar(){
            if(!this.monto || !this.selectCat || !this.selectTipo) return false
            else return true
        },

        separador(nro, tipo){
            if(+tipo === 1) {
                return '+ ' + new Intl.NumberFormat('es-CL').format(+nro) + ' GS.'
            } else {
                return '- ' + new Intl.NumberFormat('es-CL').format(+nro) + ' GS.'
            }
        },

        separador_general(nro){
            return new Intl.NumberFormat('es-CL').format(+nro) + ' GS.'
        },

        eliminar(id){
            const cat = this.datos.find(x => x.id === +id).id_cat;

            if(+cat ===  1 ) {
                Swal.fire({
                    html: '<h4>No se puede eliminar este registro<br> Favor anular la factura en<br><h5>Facturación -> Ver Factura -> Anular Factura</h5></h4>',
                    icon: 'error'
                })
            }
            else {
                Swal.fire({
                    html: '<h4>¿Desea realmente eliminar este registro?</h4>',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancelar'
                }).then((result) => { 
                    if(result.isConfirmed){
                        this.eliminar_id(id)
                    }
                })
            }
        },

        async eliminar_id(id){
            authApi.defaults.headers.common['Authorization'] = `Bearer ${this.accessToken}`

            try {
                const {data} = await authApi.delete(`/movimientos?id=${id}`)
                if(data.id === 0) {
                    Swal.fire({
                        html: '<h4>Movimiento eliminado</h4>',
                        icon: 'success'
                    }).then(() => { this.$router.go() })

                } else {
                    Swal.fire({
                        html: '<h4>Error al eliminar el registro</h4>',
                        icon: 'error'
                    })
                }

            } catch (error) {
                console.log(error)
                Swal.fire({
                    html: '<h4>Error al conectar con la base de datos</h4>',
                    icon: 'error'
                })
            }

        }
    },
}
</script>

<style scoped>
    .contenedor{
        padding: 10px 25px 10px 25px;
    }

    table {
        text-align: center;
    }

    .posicionar{
        margin-right: auto;
    }
</style>