<template>
    <div>
        <!--MODAL MEDIO DE PAGO-->
        <div class="modal fade bd-example-modal-lg" id="modal_medio_pago" data-bs-backdrop="static">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Opciones de pago (Pagado {{separador_miles(this.valor_actual_pago)}} Gs.)</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" ref="cerrar_pagos_modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-3">
                                <label>&nbsp;Saldo a pagar</label>
                                <input v-model="saldo_texto" type="text" class="form-control" disabled>
                            </div>
                            <div class="col-3">
                                <label>&nbsp;Monto pago</label>
                                <input v-model="monto_pago" class="form-control" type="number">
                            </div>
                            <div class="col-4">
                                <label>&nbsp;Medio de pago</label>
                                <select v-model="medio_pago" class="form-select" @change="cambiar_medio_pago">
                                    <option value=1 selected>Efectivo</option>
                                    <option value=2>Tarjeta de Crédito</option>
                                    <option value=3>Tarjeta de Débito</option>
                                    <option value=4>Transferencia</option>
                                    <option value=5>Billetera Electrónica</option>
                                </select>
                            </div>
                            <div class="col-2">
                                <br>
                                <button type="button" class="btn btn-success text-white" @click="agregar_item_pago()" style="width: 100%;">Agregar</button>
                            </div>
                        </div>

                        <br>

                        <div>
                            <div class="row">
                                <div class="col-3" v-show="mostrar_deno_pago">
                                    <label>&nbsp;Denominación</label>
                                    <select v-model="denominacion_pago" class="form-select">
                                        <option value=1 selected>Visa</option>
                                        <option value=2>Mastercard</option>
                                        <option value=3>American Express</option>
                                        <option value=4>Maestro</option>
                                        <option value=5>Panal</option>
                                        <option value=6>Cabal</option>
                                        <option value=7>Otro</option>
                                    </select>
                                </div>

                                <div class="col-3" v-show="mostrar_deno_bill_pago">
                                    <label>&nbsp;Denominación</label>
                                    <select v-model="bill_pago" class="form-select">
                                        <option value=1 selected>Zimple</option>
                                        <option value=2>Tigo</option>
                                        <option value=3>Personal</option>
                                        <option value=4>Claro</option>
                                    </select>
                                </div>

                                <div class="col-3" v-show="mostrar_banco_pago">
                                    <label>&nbsp;Entidad</label>
                                    <select v-model="entidad" class="form-select">
                                        <option value=1 selected>Banco</option>
                                        <option value=2>Financiera</option>
                                        <option value=3>Cooperativa</option>
                                    </select>
                                </div>

                                <div class="col-3" v-show="mostrar_nro_tarj_pago">
                                    <label>&nbsp;Nro tarjeta (4 úl. dígitos)</label>
                                    <input v-model="nro_tar_pago" class="form-control" type="number">
                                </div>

                                <div class="col-3" v-show="mostrar_cuenta_pago">
                                    <label>&nbsp;Cuenta</label>
                                    <input v-model="cuenta_pago" class="form-control" type="number">
                                </div>

                                <div class="col-3" v-show="mostrar_telefono_pago">
                                    <label>&nbsp;Teléfono</label>
                                    <input v-model="telef_pago" class="form-control" type="number">
                                </div>

                                <div class="col-3" v-show="mostrar_auto_pago">
                                    <label>&nbsp;Código Autorización</label>
                                    <input v-model="cod_aut" class="form-control" type="number">
                                </div>

                            </div>
                        </div>  

                        <br>

                        <div>
                            <VueGoodTable
                                :columns="co_formas"
                                :rows="ro_formas"
                                styleClass="vgt-table condensed bordered striped"
                                :pagination-options="{
                                    enabled: false 
                                }"
                            >
                                <template #emptystate>
                                    <div class="text-center">No hay información de pago</div>
                                </template>

                                <template #table-row="props">
                                    <div v-if="props.column.field == 'controles'" class="text-center">
                                        <button class="btn btn-danger" @click="delete_item_medio_pago(props.row.id)">
                                            <i class="fas fa-trash-alt"></i>
                                        </button>
                                    </div>

                                    <div v-if="props.column.field == 'monto'">
                                        {{ separador_miles(props.row.monto) + ' GS.'}}
                                    </div>
                                </template>

                            </VueGoodTable>
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-danger" @click="cancelar_pagos">Cancelar</button>
                        <button type="button" class="btn btn-success" @click="confirmar_pago">Confirmar</button>
                    </div>
                </div>
            </div>
        </div>
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modal_medio_pago" ref="boton_medio_pago" style="display: none;">
            boton oculto
        </button>
        <!--FIN MEDIO DE PAGO-->

        <!--MODAL MODIFICAR ITEM-->
        <div class="modal fade bd-example-modal-lg" id="modal_modificar_item" data-bs-backdrop="static">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Modificar item</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" @click="calcular_cantidad" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col">
                                <label for="doc">Cantidad <label style="color: red">*</label></label>
                                <select v-model="cantidad" class="form-select" @change="cambiar_cantidad">
                                    <option value=1 selected>1</option>
                                    <option value=2>2</option>
                                    <option value=3>3</option>
                                    <option value=4>4</option>
                                    <option value=5>5</option>
                                    <option value=6>6</option>
                                    <option value=7>7</option>
                                    <option value=8>8</option>
                                    <option value=9>9</option>
                                    <option value=10>10</option>
                                </select>
                            </div>
                            <div class="col-6">
                                <label>&nbsp;Tipo consulta <label style="color: red">*</label></label>
                                <select v-model="selectedEsp" class="form-select" @change="cambio_especialidad">
                                    <option 
                                        v-for="item in especialidades" 
                                        :key="item.id_especialidad"
                                        :value="item.id_especialidad"
                                    >
                                        {{item.descripcion}}
                                    </option>
                                </select>
                            </div>
                            <div class="col">
                                <label for="doc">Precio Unidad</label>
                                <input :value="separador_miles(unidad_item)" type="text" class="form-control" disabled>
                            </div>
                            <div class="col">
                                <label for="doc">Total </label>
                                <input :value="separador_miles(total_item)" type="text" class="form-control" disabled>
                            </div>
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-danger" @click="calcular_cantidad" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-success" data-bs-dismiss="modal" @click="modificar_item_factura_rows">Modificar</button>
                    </div>
                </div>
            </div>
        </div>
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modal_modificar_item" ref="boton_modificar_item" style="display: none;">
            boton oculto
        </button>

        <!--MODAL ITEM-->
        <div class="modal fade bd-example-modal-lg" id="modal_item" data-bs-backdrop="static">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Agregar item</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" @click="calcular_cantidad" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col">
                                <label for="doc">Cantidad <label style="color: red">*</label></label>
                                <select v-model="cantidad" class="form-select" @change="cambiar_cantidad">
                                    <option value=1 selected>1</option>
                                    <option value=2>2</option>
                                    <option value=3>3</option>
                                    <option value=4>4</option>
                                    <option value=5>5</option>
                                    <option value=6>6</option>
                                    <option value=7>7</option>
                                    <option value=8>8</option>
                                    <option value=9>9</option>
                                    <option value=10>10</option>
                                </select>
                            </div>
                            <div class="col-6">
                                <label>&nbsp;Tipo consulta <label style="color: red">*</label></label>
                                <select v-model="selectedEsp" class="form-select" @change="cambio_especialidad">
                                    <option 
                                        v-for="item in especialidades" 
                                        :key="item.id_especialidad"
                                        :value="item.id_especialidad"
                                    >
                                        {{item.descripcion}}
                                    </option>
                                </select>
                            </div>
                            <div class="col">
                                <label for="doc">Precio Unidad</label>
                                <input :value="separador_miles(unidad_item)" type="text" class="form-control" disabled>
                            </div>
                            <div class="col">
                                <label for="doc">Total </label>
                                <input :value="separador_miles(total_item)" type="text" class="form-control" disabled>
                            </div>
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-danger" @click="calcular_cantidad" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-success" data-bs-dismiss="modal" @click="agregar_item_factura">Agregar</button>
                    </div>
                </div>
            </div>
        </div>
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modal_item" ref="boton_item" style="display: none;">
            boton oculto
        </button>

        <!--MODAL CLIENTE-->
        <div class="modal fade bd-example-modal-lg" id="my_modal" data-bs-backdrop="static">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">{{ txt }}</h5>
                        <button type="button" class="btn-close" id="close_modal_registro" data-bs-dismiss="modal" aria-label="Close" @click="desactivar_modificar"></button>
                    </div>

                    <div class="modal-body">
                        <div class="container">
                            <div class="row">
                                <div class="col-4">
                                    <input v-model="filtro" type="text" class="form-control" placeholder='&#x1F50E;&#xFE0E; Ingrese el nro. de doc.'>
                                </div>

                                <div class="col-8">
                                    <button class="btn btn-outline-success" @click="buscar_cliente">Buscar</button>
                                    <button class="btn btn-outline-info" style="margin-left: 10px;" @click="activar_modificar">Modificar datos</button>
                                    <button class="btn btn-outline-secondary" style="margin-left: 10px;" @click="iniciar_registro">Registrar cliente</button>
                                </div>
                            </div>

                            <br>

                            <div class="contenedor_datos">
                                <div class="row">
                                    <div class="col-sm">
                                        <label for="primer_nombre">Primer nombre <label style="color: red">*</label></label>
                                        <input v-model="pri_nom" type="text" class="form-control" id="primer_nombre" :disabled="desactivado">
                                    </div>
                                    <div class="col-sm">
                                        <label for="segundo_nombre">Segundo nombre</label>
                                        <input v-model="seg_nom" type="text" class="form-control" id="segundo_nombre" :disabled="desactivado">
                                    </div>
                                    <div class="col-sm">
                                        <label for="tercer_nombre">Tercer nombre</label>
                                        <input v-model="ter_nom" type="text" class="form-control" id="tercer_nombre" :disabled="desactivado">
                                    </div>
                                </div>
                                <br>
                                <div class="row">
                                    <div class="col-sm">
                                        <label for="primer_apellido">Primer apellido <label style="color: red">*</label></label>
                                        <input v-model="pri_ape" type="text" class="form-control" id="primer_apellido" :disabled="desactivado">
                                    </div>
                                    <div class="col-sm">
                                        <label for="segundo_apellido">Segundo apellido</label>
                                        <input v-model="seg_ape" type="text" class="form-control" id="segundo_apellido" :disabled="desactivado">
                                    </div>
                                    <div class="col-sm-2">
                                        <label for="inputState">Tipo Doc. <label style="color: red">*</label></label>
                                        <select v-model="selectedDoc" class="form-select" :disabled="desactivado">
                                            <option 
                                                v-for="item in tipos_docs" 
                                                :key="item.id"
                                                :value="item.id"
                                            >
                                                {{item.descripcion}}
                                            </option>
                                        </select>
                                    </div>
                                    <div class="col-sm-4">
                                        <label for="doc">Nro. de doc. <label style="color: red">*</label></label>
                                        <input v-model="nro_doc" type="text" class="form-control" id="doc" :disabled="desactivado">
                                    </div>
                                </div>

                                <br>
                                <div class="row">
                                    <div class="col-6">
                                        <label for="primer_apellido">Dirección <label style="color: red">*</label></label>
                                        <input v-model="direccion" type="text" class="form-control" :disabled="desactivado">
                                    </div>

                                    <div class="col-3">
                                        <label>Departamento <label style="color: red">*</label></label>
                                        <select v-model="selectedDep" class="form-select" :disabled="desactivado" @change="cambiar_ciudad">
                                            <option 
                                                v-for="item in departamentos" 
                                                :key="item.id_departamento"
                                                :value="item.id_departamento"
                                            >
                                                {{item.descripcion}}
                                            </option>
                                        </select>
                                    </div>
                                    <div class="col-3">
                                        <label>Ciudad <label style="color: red">*</label></label>
                                        <select v-model="selectedCiu" class="form-select" :disabled="desactivado"> 
                                            <option 
                                                v-for="item in ciudades" 
                                                :key="item.cod_concatenado"
                                                :value="item.cod_concatenado"
                                            >
                                                {{item.descripcion}}
                                            </option>
                                        </select>
                                    </div>
                                </div>
                                <br>

                                <div class="row">
                                    <div class="col">
                                        <label>Correo Electrónico <label style="color: red">*</label></label>
                                        <input v-model="correo_envio" type="email" class="form-control" :disabled="desactivado">
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-danger" data-bs-dismiss="modal" @click="desactivar_modificar">Cancelar</button>
                        <button type="button" class="btn btn-success" @click="seleccionar" v-show="b_seleccionar">Seleccionar</button>
                        <button type="button" class="btn btn-info text-white" @click="modificar_reg" v-show="b_modificar">Modificar</button>
                        <button type="button" class="btn btn-secondary" @click="registrar_bd" v-show="b_registrar">Registrar</button>
                    </div>
                </div>
            </div>
        </div>
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#my_modal" ref="boton" style="display: none;">
            boton oculto
        </button>
        <!--FIN MODAL CLIENTE-->

        <nav class="navbar" style="background: #c6c6c6">
            <div style="margin-left: 15px">
                <strong>Nueva factura</strong>
            </div>

            <div class="d-flex flex-row align-items-center justify-content-center">
                <div style="margin-right: 10px">
                    <button class="btn btn-danger " @click="regresar_atras">
                        CANCELAR
                    </button>
                </div>
            </div>
        </nav>

        <div>
            <div class="container">
                <br>
                <strong><p class="text-center">Datos de la factura</p></strong>
                <i><p class="text-center">{{msg}}</p></i>

                <div class="row">
                    <div class="col-sm">
                        <strong><label>&nbsp;Cliente <label style="color: red">*</label></label></strong>
                        <input v-model="cliente" class="form-select" @click="menu_cliente" readonly>
                    </div>
                    <div class="col-sm">
                        <strong><label>&nbsp;Condición de Venta <label style="color: red">*</label></label></strong>
                        <select class="form-select"> 
                            <option selected>CONTADO</option>
                        </select>
                    </div>
                    <div class="col-sm">
                        <strong><label>&nbsp;Metodos de pago <label style="color: red">*</label></label></strong>
                        <input v-model="selectPago" class="form-select" @click="menu_medio_pago" readonly>
                    </div>
                </div>
            </div>
            <hr>

            <div class="container" style="margin-bottom: 20px;">
                <strong><p class="text-center">Detalles de la factura</p></strong>
                <nav class="navbar" style="background-color: #c6c6c6; border-radius: 15px;">
                    <div style="margin-left: 15px">
                        <label style="font-size: 20px;"><strong>TOTAL: </strong><strong style="color: rgb(2, 162, 69)">{{ separador_miles(total_general) + ' GS.'}}</strong></label>
                    </div>

                    <div class="d-flex flex-row align-items-center justify-content-center">
                        <div style="margin-right: 10px">
                            <button class="btn text-white" style="margin-left: 10px; background-color: #2b59a2;" @click="menu_item">AGREGAR ITEM</button>
                            <button class="btn btn-otros" style="margin-left: 10px;" @click="confirmar_generacion">CONFIRMAR Y GENERAR</button>
                        </div>
                    </div>
                </nav>
            </div>

            <div class="container">
                <VueGoodTable
                    :columns="columns"
                    :rows="rows"
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
                        <div class="text-center">No hay items para esta factura</div>
                    </template>

                    <template #table-row="props">
                        <span v-if="props.column.field == 'controles'">
                            <button style="height: 35px;" class="btn btn-info text-white" @click="modificar_item_factura(props.row.id)"><i class="fas fa-edit"></i>&nbsp;&nbsp;Modificar</button>
                            <button style="margin-left: 10px; height: 35px;" class="btn btn-danger" @click="delete_item(props.row.id)"><i class="fas fa-trash-alt"></i>&nbsp;&nbsp;Eliminar</button>
                        </span>

                        <span v-else>
                            {{props.formattedRow[props.column.field]}}
                        </span>
                    </template>
                </VueGoodTable>
            </div>
        </div>
    </div>
</template>

<script>
import { VueGoodTable } from 'vue-good-table-next';
import 'vue-good-table-next/dist/vue-good-table-next.css'

import { mapGetters} from 'vuex'
import authApi from '@/api/authApi'
import 'bootstrap';
import Swal  from 'sweetalert2'

import 'jquery/dist/jquery.min.js';
//import * as $ from 'jquery';

import MailChecker from 'mailchecker'


export default {
    async created(){
        document.title = 'Nueva factura'
        await this.obtener_especialidad_cita()
        await this.get_tipos_documentos()
        await this.inicial()
        this.calcular_cantidad()
        await this.obtener_id_timbrado()

        this.saldo_pagar = this.total_general
        this.saldo_texto = this.separador_miles(this.total_general) + ' GS.'

        this.get_departamentos()
        this.get_ciudades()
    },

    computed:{
        ...mapGetters('auth', ['accessToken', 'username']),
    },

    components: {
        VueGoodTable,
    },

    watch: {
        saldo_pagar() {
            this.saldo_texto = this.separador_miles(this.saldo_pagar) + ' GS.'
        },

        total_general() {
            this.actualizar_total_pago()
        }
    },

    data() {
        return {
            correo_envio: null,
            msg: null,
            departamentos: null,
            ciudades: null,
            selectedDep: 0,
            selectedCiu: 0,

            //MEDIOS DE PAGO
            selectPago: 'PENDIENTE',
            saldo_pagar: null,
            monto_pago: null,
            medio_pago: 1,
            valor_actual_pago: 0,
            saldo_texto: null,

            denominacion_pago: 1,
            cuenta_pago: null,
            telef_pago: null,
            cod_aut: null,
            nro_tar_pago: null,
            entidad: 1,
            bill_pago: 1,

            mostrar_deno_pago: false,
            mostrar_cuenta_pago: false,
            mostrar_telefono_pago: false,
            mostrar_auto_pago: false,
            mostrar_deno_bill_pago: false,
            mostrar_nro_tarj_pago: false,
            mostrar_banco_pago: false,

            ro_formas: [],
            co_formas: [
                {
                    label: 'Monto',
                    field: 'monto',
                },
                {
                    label: 'Tipo',
                    field: 'tipo'
                },
                {
                    label: 'Denominación',
                    field: 'denominacion'
                },
                {
                    label: 'Autorización',
                    field: 'cod_aut'
                },
                {
                    label: '',
                    field: 'controles',
                    sortable: false,
                }
            ],

            //BOTONES
            b_seleccionar: true,
            b_modificar: false,
            b_registrar: false,

            //
            txt: 'Búsqueda de cliente',

            columns: [
                {
                    label: 'Orden',
                    field: 'id',
                },
                {
                    label: 'Descripción',
                    field: 'desc'
                },
                {
                    label: 'Cantidad',
                    field: 'cant'
                },
                {
                    label: 'P. Unitario',
                    field: 'precio_u'
                },
                {
                    label: 'Sub total',
                    field: 'total'
                },
                {
                    label: 'Porcentaje IVA',
                    field: 'porc_iva'
                },
                {
                    label: 'IVA',
                    field: 'iva'
                },
                {
                    label: 'Controles',
                    field: 'controles',
                    sortable: false
                },
            ],

            rows: [],

            datos_anteriores: null,
            completo: null,
            tabla: null,
            nro: this.$route.params.id,
            /*cliente: '5549070-9 RICHARD DAMIAN CABRERA CHENA',
            id_persona: null,*/
            cliente: null,
            id_persona: null,
            tipos_docs: null,
            selectedDoc: 1,

            /*pri_nom: 'RICHARD',
            seg_nom: 'DAMIAN',
            ter_nom: null,
            pri_ape: 'CABRERA',
            seg_ape: 'CHENA',
            nro_doc: '5549070',
            direccion: 'Av Lorenzetti 489 Central - San Lorenzo',*/

            pri_nom: null,
            seg_nom: null,
            ter_nom: null,
            pri_ape: null,
            seg_ape: null,
            nro_doc: null,
            direccion: null,

            filtro: null,
            desactivado: true,

            selectedEsp: null,
            especialidades: null,
            cantidad: null,
            total_item: null,
            unidad_item: null,
            id_a_modificar: null,

            datos: [],
            total_general: 0,

            cod_especialidad_validar: null,
            id_timbrado_fac: null,
        }
    },

    methods: {
        zeroFill( number, width ) {
            width -= number.toString().length;
            if ( width > 0 ) {
                return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
            }

            return number + ""; // siempre devuelve tipo cadena
        },

        async cambiar_ciudad(){
            await this.get_ciudades()

            if(this.selectedDep === 0) {
                this.selectedCiu = 0
            } else {
                this.selectedCiu = (this.zeroFill(this.selectedDep, 2) + '01')*1
            }
        },

        async get_departamentos(){
            const {data} = await authApi.get('/obtener_departamentos', {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })

            this.departamentos = data
        },

        async get_ciudades(){
            const {data} = await authApi.get('/obtener_ciudades', {
                params: {
                    cod: this.selectedDep
                },
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })

            this.ciudades = data
        },


        confirmar_pago(){
            if(+this.saldo_pagar !== 0){
                Swal.fire({
                    html: "<h4>El saldo debe estar en 0 GS.</h4>",
                    icon: 'error'
                })
            } else {
                this.$refs.cerrar_pagos_modal.click();
                this.selectPago = 'COBRADO'
            }
        },

        actualizar_total_pago() {
            let aux = 0;

            if(this.ro_formas.length === 0){
                this.valor_actual_pago = 0
                this.saldo_pagar = this.total_general
            } else {
                for (let i = 0; i < this.ro_formas.length; i++) {
                    aux += this.ro_formas[i].monto
                }

                this.valor_actual_pago = aux;
                this.saldo_pagar = this.total_general - aux;
            }

            this.selectPago = 'PENDIENTE'
        },

        cambiar_medio_pago(){
            this.denominacion_pago = 1
            this.cuenta_pago = null
            this.telef_pago = null
            this.cod_aut = null
            this.nro_tar_pago = null
            this.entidad = 1
            this.bill_pago = 1


            if(+this.medio_pago === 1) {
                this.mostrar_deno_pago = false;
                this.mostrar_cuenta_pago = false;
                this.mostrar_telefono_pago = false;
                this.mostrar_auto_pago = false;
                this.mostrar_deno_bill_pago = false;
                this.mostrar_nro_tarj_pago = false;
                this.mostrar_banco_pago = false;
    

            } else if (+this.medio_pago === 2 || +this.medio_pago === 3) {
                this.mostrar_deno_pago = true;
                this.mostrar_cuenta_pago = false;
                this.mostrar_telefono_pago = false;
                this.mostrar_auto_pago = true;
                this.mostrar_deno_bill_pago = false;
                this.mostrar_nro_tarj_pago = true;
                this.mostrar_banco_pago = false;

            } else if (+this.medio_pago === 4) {
                this.mostrar_deno_pago = false;
                this.mostrar_cuenta_pago = true;
                this.mostrar_telefono_pago = false;
                this.mostrar_auto_pago = true;
                this.mostrar_deno_bill_pago = false;
                this.mostrar_nro_tarj_pago = false;
                this.mostrar_banco_pago = true;

            } else if (+this.medio_pago === 5) {
                this.denominacion_pago = 8;

                this.mostrar_deno_pago = false;
                this.mostrar_cuenta_pago = false;
                this.mostrar_telefono_pago = true;
                this.mostrar_auto_pago = true;
                this.mostrar_deno_bill_pago = true;
                this.mostrar_nro_tarj_pago = false;
                this.mostrar_banco_pago = false;
            }
        },

        cancelar_pagos(){
            this.$refs.cerrar_pagos_modal.click();

            this.mostrar_deno_pago = false;
                this.mostrar_cuenta_pago = false;
                this.mostrar_telefono_pago = false;
                this.mostrar_auto_pago = false;
                this.mostrar_deno_bill_pago = false;
                this.mostrar_nro_tarj_pago = false;
                this.mostrar_banco_pago = false;
        },
        
        regresar_atras(){
            this.$router.push({ path: '/pagos' });
        },

        async modificar_reg(){
            if(!this.pri_nom || !this.pri_ape || !this.nro_doc || !this.direccion || !MailChecker.isValid(this.correo_envio)){
                Swal.fire({
                html: "<h4>Debe completar todos los campos y ser válidos</h4>",
                icon: 'error'})

            } else {
                const obj = {
                    id: this.id_persona,
                    tabla: this.tabla,
                    pri_nom: this.pri_nom,
                    seg_nom: this.seg_nom,
                    ter_nom: this.ter_nom,
                    pri_ape: this.pri_ape,
                    seg_ape: this.seg_ape,
                    tipo_doc: this.selectedDoc,
                    nro_doc: this.nro_doc,
                    dir: this.direccion,
                    lug: this.selectedCiu,
                    email: this.correo_envio
                }

                authApi.defaults.headers.common['Authorization'] = `Bearer ${this.accessToken}`
                const {data} = await authApi.put('/pagos/datos_cliente', obj)

                if(data.id === 0){
                    Swal.fire({
                    html: "<h4>Modificado exitosamente</h4>",
                    icon: 'success',})
                    .then(() => {
                        document.getElementById('close_modal_registro').click();
                        let a, b, c;

                        if(!this.seg_nom) a = ''; else a = this.seg_nom
                        if(!this.ter_nom) b = ''; else b = this.ter_nom
                        if(!this.seg_ape) c = ''; else c = this.seg_ape

                        let com = this.nro_doc + ' ' + this.pri_nom + ' ' + a + ' ' + b + ' ' + this.pri_ape + ' ' + c;
                        this.cliente = com.split(' ').filter((item) => item.length !== 0).join(' ')
                    })
                } else {
                    Swal.fire({
                    html: "<h4>Error al registrar en la base de datos</h4>",
                    icon: 'error'})
                }
            }
        },

        async insert_reg_pagos(nro_factura) {
            let resp = 1;

            for (let i = 0; i < this.ro_formas.length; i++) {
                authApi.defaults.headers.common['Authorization'] = `Bearer ${this.accessToken}`

                const {data} = await authApi.post('/facturacion/pagos', {
                    cod_factura: nro_factura,
                    forma_pago: this.ro_formas[i].forma_pago,
                    monto: this.ro_formas[i].monto,
                    marca: this.ro_formas[i].marca,
                    nro_tar: this.ro_formas[i].nro_tar,
                    nro_cuenta: this.ro_formas[i].nro_cuenta,
                    nro_telefono: this.ro_formas[i].nro_telefono,
                    cod_referencia: this.ro_formas[i].cod_referencia
                })

                resp = +data.id;
            }

            return resp;
        },

        async confirmar_generacion() {
            if(this.saldo_pagar !== 0){
                Swal.fire({
                html: "<h4>Aún no se ha ingresado el método de pago</h4>",
                icon: 'error'})
            } else {
                if(this.rows.length === 0){
                    Swal.fire({
                    html: "<h4>No hay items para esta factura</h4>",
                    icon: 'error'})
                } else {
                    Swal.fire({
                    html: `<h4>Favor confirmar el cobro de ${this.separador_miles(this.total_general)} GS.</h4>`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Confirmar',
                    cancelButtonText: 'Cancelar'})
                    .then((result) => {
                        if (result.isConfirmed) {
                            this.generar_factura_pdf()
                        }
                    })
                }
            }
        },

        async generar_factura_pdf(){
            if(this.rows.length === 0){
                Swal.fire({
                html: "<h4>No hay items para esta factura</h4>",
                icon: 'error'})
            } else {
                let comprobar = false;
                for (let i = 0; i < this.rows.length; i++) {
                    if(this.rows[i].id_especialidad === this.cod_especialidad_validar) comprobar = true;
                }

                if(!comprobar){
                    Swal.fire({
                    html: "<h4>No se ha seleccionado el item de la cita seleccionada</h4>",
                    icon: 'error'})
                } else {
                    if(!this.id_timbrado_fac){
                        Swal.fire({
                        html: "<h4>Favor verificar los parámetros de timbrados</h4>",
                        icon: 'error'})
                    } else {
                        let id_factura, nro_fac_generado;

                        id_factura = await this.generar_id_factura();
                        if(!id_factura){
                            Swal.fire({
                            html: "<h4>No se pudo generar la factura<br>Intentelo más tarde</h4>",
                            icon: 'error'})
                        } else {
                            let items;
                            items = await this.agregar_items(id_factura);

                            if(items === 1) {
                                let data, resp_pagos;
                                resp_pagos = await this.insert_reg_pagos(id_factura);
                                data = await this.obtener_nro_factura(id_factura)
                                nro_fac_generado = data.nro

                                if(!nro_fac_generado) {
                                    Swal.fire({
                                    html: "<h4>No se pudo obtener el número de factura generado<br>Intentelo más tarde</h4>",
                                    icon: 'error'})
                                } else if(resp_pagos !== 0) {
                                    Swal.fire({
                                    html: "<h4>Hubo un error al ingresar los pagos a la factura</h4>",
                                    icon: 'error'})
                                } else {
                                    Swal.fire({
                                    html: `<h4>Se ha generado la factura <br>#${nro_fac_generado}<br>Código: ${data.id_pdf}</h4>`,
                                    icon: 'success',
                                    showDenyButton: true,
                                    showCancelButton: true,
                                    confirmButtonColor: '#3085d6',
                                    cancelButtonColor: '#d33',
                                    denyButtonColor: '#198754',
                                    denyButtonText: 'Ver y enviar comprobante',
                                    confirmButtonText: 'Ver factura',
                                    cancelButtonText: 'Ir a pagos'})
                                    .then((result) => {
                                        if (result.isConfirmed) {
                                            this.$router.push({ path: '/pagos/consulta_factura/' + this.$route.params.id })
                                        } else if (result.isDenied) {
                                            this.enviar_comprobante(nro_fac_generado, data.id_pdf)
                                            this.$router.push({ path: '/pagos/consulta_factura/' + this.$route.params.id })
                                        } else {
                                            this.$router.push({ path: '/pagos' });
                                        }
                                    })
                                }
                            } else {
                                Swal.fire({
                                html: "<h4>No cargar los items de la factura<br>Intentelo más tarde</h4>",
                                icon: 'error'})
                            }
                        }
                    }
                }
            }
        },

        async obtener_correo(nro_factura){
            /*const {data} = await authApi.get('/obtener_correo?id_cita=' + this.$route.params.id, {              
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })

            return data;*/

            const {data} = await authApi.get('/obtener_correo?nro_factura=' + nro_factura, {              
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })

            return data;
        },

        async enviar_comprobante(nro_factura, id_pdf){
            const email = await this.obtener_correo(nro_factura);

            const {data} = await authApi.get('/facturacion/prueba', {
                params: {
                    email,
                    nro_factura,
                    id_pdf
                },
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })

            console.log(data)
        },

        async obtener_nro_factura(id){
            authApi.defaults.headers.common['Authorization'] = `Bearer ${this.accessToken}`

            const {data} = await authApi.post('/facturacion/emitir', {
                id_factura: id
            })

            return data;
        },

        async agregar_items(id){
            let resp = 1;

            for (let i = 0; i < this.rows.length; i++) {
                authApi.defaults.headers.common['Authorization'] = `Bearer ${this.accessToken}`

                const {data} = await authApi.post('/facturacion/item', {
                    id_factura: id,
                    id_esp: this.rows[i].id_especialidad,
                    cantidad: this.rows[i].cant
                })
            
                if(data.id === 0) {
                    resp = 0;
                    break;
                }

            }

            return resp;
        },

        async generar_id_factura(){
            authApi.defaults.headers.common['Authorization'] = `Bearer ${this.accessToken}`
            const {data} = await authApi.post('/facturacion', {
                id_timbrado: this.id_timbrado_fac,
                condicion: 'C',
                id_cita: this.$route.params.id,
                id_persona: this.id_persona,
                tabla: this.tabla})
            
            return data.id
        },

        async obtener_id_timbrado(){
            const {data} = await authApi.get('/facturacion/obtener_timbrado', {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })

            this.id_timbrado_fac = data.id
        },

        async obtener_especialidad_cita(){
            const {data} = await authApi.get('/facturacion/consulta_item?id_cita=' + this.$route.params.id, {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })

            if(!data.id_especialidad){
                this.$router.push({ path: '/pagos' });
            }

            let nom = data.nombre.split(' ').filter((item) => item.length !== 0).join(' ')

            this.cod_especialidad_validar = data.id_especialidad
            this.cliente = data.completo.split(' ').filter((item) => item.length !== 0).join(' ')
            this.id_persona = data.id_persona
            this.tabla = 'TABLA_PERSONAS'
            this.msg = 'Consulta de ' + nom + ' del día ' + data.fecha
        },

        modificar_item_factura_rows(){
            let filterObj = this.especialidades.filter((item) => item.id_especialidad === this.selectedEsp);

            this.rows[this.id_a_modificar - 1].id_especialidad = +this.selectedEsp
            this.rows[this.id_a_modificar - 1].desc = 'Consulta - ' + filterObj[0].descripcion
            this.rows[this.id_a_modificar - 1].cant = +this.cantidad
            this.rows[this.id_a_modificar - 1].precio_u = +this.unidad_item
            this.rows[this.id_a_modificar - 1].total = +this.total_item
            this.rows[this.id_a_modificar - 1].iva = +this.obtener_iva(10, this.total_item)

            this.calcular_cantidad() // Restablecer los valores del "agregar items"
            this.total_general = this.rows.reduce((accumulator, object) => { return accumulator + object.total;}, 0);
        },

        modificar_item_factura(id){
            this.id_a_modificar = id
            this.cantidad = this.rows[id - 1].cant
            this.selectedEsp = this.rows[id - 1].id_especialidad
            this.unidad_item = this.rows[id - 1].precio_u
            this.total_item = this.rows[id - 1].precio_u * this.cantidad

            this.$refs.boton_modificar_item.click();
        },

        separador_miles(nro) {
            return new Intl.NumberFormat('es-CL').format(nro)
        },

        cambiar_cantidad(){
            let filterObj = this.especialidades.filter((item) => item.id_especialidad === this.selectedEsp);

            this.unidad_item = filterObj[0].precio
            this.total_item = filterObj[0].precio * this.cantidad
        },

        calcular_cantidad(){
            this.selectedEsp = 1
            this.cantidad = 1

            let filterObj = this.especialidades.filter((item) => item.id_especialidad === 1);

            this.unidad_item = filterObj[0].precio
            this.total_item = filterObj[0].precio * this.cantidad
        },

        cambio_especialidad(){
            let filterObj = this.especialidades.filter((item) => item.id_especialidad === this.selectedEsp);
            this.unidad_item = filterObj[0].precio
            this.total_item = filterObj[0].precio * this.cantidad
        },

        async inicial(){
            await this.obtener_especialidades()
            let filterObj = this.especialidades.filter((item) => item.id_especialidad === this.cod_especialidad_validar);
            this.rows.push({
                    id: 1, 
                    id_especialidad: filterObj[0].id_especialidad,
                    desc: 'Consulta - ' + filterObj[0].descripcion, 
                    cant: 1, 
                    precio_u: +filterObj[0].precio, 
                    total: +this.obtener_total(1, filterObj[0].precio), 
                    porc_iva: 10, 
                    iva: +this.obtener_iva(10, this.obtener_total(1, filterObj[0].precio))
            })

            this.total_general = this.obtener_total(1, filterObj[0].precio)
        },

        delete_item(id){
            Swal.fire({
            html: "<h4>¿Desea eliminar este item?</h4>",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancelar'})
            .then((result) => {
                if (result.isConfirmed) {
                    const objWithIdIndex = this.rows.findIndex((obj) => obj.id === id);
                    this.rows = this.rows.slice(0,objWithIdIndex).concat(this.rows.slice(objWithIdIndex+1))

                    //Modificar orden
                    for (var i = 0; i < this.rows.length; i++) {
                        this.rows[i].id = i + 1
                    }

                    this.total_general = this.rows.reduce((accumulator, object) => { return accumulator + object.total;}, 0);
                }
            })
        },
        
        agregar_item_pago_array(){
            let max;

            if(this.ro_formas.length === 0){
                max = 0
            } else {
                max = Math.max.apply(Math, this.ro_formas.map(function(o) { return o.id; }))
            }

            let medios_let = ['Efectivo', 'Tarjeta de Crédito', 'Tarjeta de Débito', 'Transferencia', 'Billetera Electrónica']
            let denominacion = ['Visa', 'Mastercard', 'American Express', 'Maestro', 'Panal', 'Cabal', 'Otro']
            let entidad = ['Banco', 'Financiera', 'Cooperativa']
            let bill = ['Zimple', 'Tigo', 'Personal', 'Claro']

            if(+this.medio_pago === 1) {
                this.ro_formas.push({
                    id: max + 1,
                    monto: this.monto_pago,
                    forma_pago: 'EF',
                    tipo: medios_let[+this.medio_pago - 1],
                    denominacion: 'No aplica',
                    cod_aut: this.cod_aut || 'No aplica'
                })
            } else if(+this.medio_pago === 2 || +this.medio_pago === 3){
                this.ro_formas.push({
                    id: max + 1,
                    monto: this.monto_pago,
                    forma_pago: +this.medio_pago === 2 ? 'TC': 'TD',
                    marca: denominacion[+this.denominacion_pago - 1],
                    nro_tar: this.nro_tar_pago,
                    cod_referencia: this.cod_aut,
                    tipo: medios_let[+this.medio_pago - 1],
                    denominacion: denominacion[+this.denominacion_pago - 1] + ' - ' + this.nro_tar_pago,
                    cod_aut: this.cod_aut || 'No aplica'
                })
            } else if(+this.medio_pago === 4){
                this.ro_formas.push({
                    id: max + 1,
                    monto: this.monto_pago,
                    forma_pago: 'TR',
                    marca: entidad[+this.entidad - 1],
                    nro_cuenta: this.cuenta_pago,
                    cod_referencia: this.cod_aut,
                    tipo: medios_let[+this.medio_pago - 1],
                    denominacion: entidad[+this.entidad - 1] + ' - ' + this.cuenta_pago,
                    cod_aut: this.cod_aut || 'No aplica'
                })
            } else if(+this.medio_pago === 5){
                this.ro_formas.push({
                    id: max + 1,
                    monto: this.monto_pago,
                    forma_pago: 'BI',
                    marca: bill[+this.bill_pago - 1],
                    nro_telefono: this.telef_pago,
                    cod_referencia: this.cod_aut,
                    tipo: medios_let[+this.medio_pago - 1],
                    denominacion: bill[+this.bill_pago - 1] + ' - ' + this.telef_pago,
                    cod_aut: this.cod_aut || 'No aplica'
                })
            }
            
            this.monto_pago = null;
            this.medio_pago = 1;
            this.denominacion_pago = 1
            this.nro_tar_pago = null
            this.cod_aut = null

            /* */
            this.mostrar_deno_pago = false;
            this.mostrar_cuenta_pago = false;
            this.mostrar_telefono_pago = false;
            this.mostrar_auto_pago = false;
            this.mostrar_deno_bill_pago = false;
            this.mostrar_nro_tarj_pago = false;
            this.mostrar_banco_pago = false;

            this.actualizar_total_pago()
        },

        agregar_item_pago(){
            if(+this.medio_pago === 1){
                if(!this.monto_pago || +this.monto_pago <= 0) {
                    Swal.fire({
                        html: "<h4>Debe ingresar todos los campos y ser válidos</h4>",
                        icon: 'error'
                    })
                } else {
                    this.agregar_item_pago_array()
                }
            }

            if(+this.medio_pago === 2 || +this.medio_pago === 3){
                if(!this.monto_pago || !this.nro_tar_pago || !this.cod_aut || +this.monto_pago <= 0) {
                    Swal.fire({
                        html: "<h4>Debe ingresar todos los campos y ser válidos</h4>",
                        icon: 'error'
                    })
                } else {
                    if(this.nro_tar_pago.toString().length !== 4) {
                        Swal.fire({
                            html: "<h4>Solo ingresar los últimos 4 dígitos de la tarjeta</h4>",
                            icon: 'error'
                        })
                    } else {
                        this.agregar_item_pago_array()
                    }
                }
            }

            if(+this.medio_pago === 4){
                if(!this.monto_pago || !this.cuenta_pago || !this.cod_aut || +this.monto_pago <= 0) {
                    Swal.fire({
                        html: "<h4>Debe ingresar todos los campos y ser válidos</h4>",
                        icon: 'error'
                    })
                } else {
                    this.agregar_item_pago_array()
                }
            }

            if(+this.medio_pago === 5 || +this.monto_pago < 0){
                if(!this.monto_pago || !this.telef_pago || !this.cod_aut || +this.monto_pago <= 0) {
                    Swal.fire({
                        html: "<h4>Debe ingresar todos los campos y ser válidos</h4>",
                        icon: 'error'
                    })
                } else {
                    this.agregar_item_pago_array()
                }
            }
        },

        delete_item_medio_pago(id){
            Swal.fire({
            html: "<h4>¿Desea eliminar este medio de pago?</h4>",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancelar'})
            .then((result) => {
                if (result.isConfirmed) {
                    const objWithIdIndex = this.ro_formas.findIndex((obj) => obj.id === id);
                    this.ro_formas = this.ro_formas.slice(0,objWithIdIndex).concat(this.ro_formas.slice(objWithIdIndex+1))

                    //Modificar orden
                    for (var i = 0; i < this.ro_formas.length; i++) {
                        this.ro_formas[i].id = i + 1
                    }

                    this.actualizar_total_pago()
                    this.selectPago = 'PENDIENTE'
                }
            })
        },

        async registrar_bd (){
            const {data} = await authApi.get('/pagos/datos_cliente/consulta?nro_doc=' + this.nro_doc + '&tipo_doc=' + this.selectedDoc, {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })

            if(data.cantidad === '1'){
                Swal.fire({
                html: "<h4>Documento ya registrado</h4>",
                icon: 'error'})
            } else {
                if(!this.pri_nom || !this.pri_ape || !this.nro_doc || !this.direccion){
                    Swal.fire({
                    html: "<h4>Debe completar todos los campos</h4>",
                    icon: 'error'})

                } else {
                    const obj = {
                    pri_nom: this.pri_nom,
                    seg_nom: this.seg_nom,
                    ter_nom: this.ter_nom,
                    pri_ape: this.pri_ape,
                    seg_ape: this.seg_ape,
                    tipo_doc: this.selectedDoc,
                    nro_doc: this.nro_doc,
                    dir: this.direccion,
                    lug: this.selectedCiu,
                    email: this.correo_envio
                    }

                    authApi.defaults.headers.common['Authorization'] = `Bearer ${this.accessToken}`
                    const {data} = await authApi.post('/pagos/datos_cliente', obj)

                    this.cliente = data.completo.split(' ').filter((item) => item.length !== 0).join(' ')
                    this.id_persona = data.id
                    this.tabla = data.tabla

                    if(data.completo){
                        Swal.fire({
                        html: "<h4>Creado exitosamente</h4>",
                        icon: 'success',})
                        .then(() => {
                            document.getElementById('close_modal_registro').click();
                            this.pri_nom = undefined
                            this.seg_nom = undefined
                            this.ter_nom = undefined
                            this.pri_ape = undefined
                            this.seg_ape = undefined
                            this.selectedDoc = 1
                            this.nro_doc = undefined
                            this.direccion = undefined
                            this.selectedDep = 0
                            this.get_ciudades()
                            this.selectedCiu = 0
                            this.correo_envio = undefined
                        })
                    } else {
                        Swal.fire({
                        html: "<h4>Error al registrar en la base de datos</h4>",
                        icon: 'error'})
                    }
                }
            }
        },

        iniciar_registro(){
            this.txt = 'Registro de cliente'

            this.b_seleccionar = false
            this.b_modificar = false
            this.b_registrar = true

            this.desactivado = false

            this.pri_nom = undefined
            this.seg_nom = undefined
            this.ter_nom = undefined
            this.pri_ape = undefined
            this.seg_ape = undefined
            this.selectedDoc = 1
            this.nro_doc = undefined
            this.direccion = undefined
            this.correo_envio = undefined
        },

        async buscar_cliente(){
            this.txt = 'Búsqueda de cliente'
            this.desactivar_modificar()

            const {data} = await authApi.get('/pagos/datos_cliente?nro_doc=' + this.filtro, {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })

            if(data.primer_nombre){
                //DATOS ANTERIORES
                this.datos_anteriores = {
                    cliente: this.cliente,
                    pri_nom: this.pri_nom,
                    seg_nom: this.seg_nom,
                    ter_nom: this.ter_nom,
                    pri_ape: this.pri_ape,
                    seg_ape: this.seg_ape,
                    selectedDoc: this.selectedDoc,
                    nro_doc: this.nro_doc,
                    direccion: this.direccion,
                    id_persona: this.id_persona,
                    selectedDep: this.selectedDep,
                    selectedCiu: this.selectedCiu,
                    email: this.correo_envio,
                }

                //DATOS RECIBIDOS
                this.tabla = data.tabla
                this.completo = data.completo.toUpperCase().replace('  ', ' ')
                this.pri_nom = data.primer_nombre 
                this.seg_nom = data.segundo_nombre
                this.ter_nom = data.tercer_nombre
                this.pri_ape = data.primer_apellido
                this.seg_ape = data.segundo_apellido
                this.selectedDoc = data.tipo_doc
                this.nro_doc = data.nro_doc
                this.direccion = data.direccion
                this.id_persona = data.id_persona
                this.selectedDep = data.departamento
                await this.get_ciudades()
                this.selectedCiu = data.ciudad
                this.correo_envio = data.email

            } else {
                this.pri_nom = null 
                this.seg_nom = null
                this.ter_nom = null
                this.pri_ape = null
                this.seg_ape = null
                this.selectedDoc = null
                this.nro_doc = null
                this.direccion = null
                this.correo_envio = null

                Swal.fire({
                    html: "<h4>No existe el cliente solicitado</h4>",
                    icon: 'error'
                })
            }
        },

        seleccionar (){
            if(!this.pri_nom){
                Swal.fire({
                    html: "<h4>Favor ingresar un número de documento</h4>",
                    icon: 'error'
                })
            } else {
                this.cliente = this.completo.split(' ').filter((item) => item.length !== 0).join(' ')
                document.getElementById('close_modal_registro').click();
            }
        },

        cancelar_seleccion(){
            this.pri_nom = this.datos_anteriores.pri_nom 
            this.seg_nom = this.datos_anteriores.seg_nom
            this.ter_nom = this.datos_anteriores.ter_nom
            this.pri_ape = this.datos_anteriores.pri_ape
            this.seg_ape = this.datos_anteriores.seg_ape
            this.selectedDoc = this.datos_anteriores.selectedDoc
            this.nro_doc = this.datos_anteriores.nro_doc
            this.direccion = this.datos_anteriores.direccion
            this.id_persona = this.datos_anteriores.id_persona

            this.seleccionar()
        },

        agregar_item_factura(){
            let filterObj = this.especialidades.filter((item) => item.id_especialidad === this.selectedEsp);
            let max;

            if(this.rows.length === 0){
                max = 0
            } else {
                max = Math.max.apply(Math, this.rows.map(function(o) { return o.id; }))
            }

            const obj = 
            {    
                id: max + 1,
                id_especialidad: filterObj[0].id_especialidad,
                desc: 'Consulta - ' + filterObj[0].descripcion, 
                cant: +this.cantidad, 
                precio_u: +this.unidad_item, 
                total: +this.total_item, 
                porc_iva: 10, 
                iva: +this.obtener_iva(10, this.total_item)
            }

            this.rows.push(obj)
            this.calcular_cantidad() // Restablecer los valores del "agregar items"
            this.total_general = this.rows.reduce((accumulator, object) => { return accumulator + object.total;}, 0);
        },

        obtener_grabada(porc_iva, monto){
            if(porc_iva === 10){
                return monto - (monto / 11)

            } else if (porc_iva === 5){
                return monto - (monto / 21)
                
            } else if (porc_iva === 0){
                return 0

            } else {
                return null
            }
        },

        obtener_iva(porc_iva, monto){
            if(porc_iva === 10){
                return (monto / 11).toFixed(2)

            } else if (porc_iva === 5){
                return (monto / 21).toFixed(2)
                
            } else if (porc_iva === 0){
                return 0

            } else {
                return null
            }
        },

        obtener_total(cant, precio){
            return cant * precio
        },

        menu_cliente(){
            this.$refs.boton.click();
        },

        menu_medio_pago(){
            this.$refs.boton_medio_pago.click();
        },
        
        menu_item(){
            this.$refs.boton_item.click();
        },

        /*menu_modificar_item(){
            this.$refs.boton_modificar_item.click();
        },*/

        async get_tipos_documentos(){
            const {data} = await authApi.get('/obtener_tipos_documento', {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })

            this.tipos_docs = data
        },

        async obtener_especialidades(){
            const {data} = await authApi.get('/obtener_especialidades', {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })

            this.especialidades = data
        },

        activar_modificar(){
            if(!this.nro_doc){
                Swal.fire({
                    html: "<h4>No se ha seleccionado un cliente</h4>",
                    icon: 'error'
                })
            } else {
                this.txt = 'Editar datos'

                this.b_seleccionar = false
                this.b_modificar = true
                this.b_registrar = false

                this.desactivado = false
            }
        },

        desactivar_modificar(){
            this.txt = 'Búsqueda de cliente'

            this.b_seleccionar = true
            this.b_modificar = false
            this.b_registrar = false

            this.desactivado = true
        }
    },
}
</script>

<style scoped>
    hr {
        margin-left: 3rem;
        margin-right: 3rem;
        border: 0;
        border-top: 1px solid black;
        padding: 0px 10px 0px 10px;
    }

    .contenedor_datos{
        padding: 15px;
        background-color: #f3f3f3;
        border-radius: 20px;
    }
</style>