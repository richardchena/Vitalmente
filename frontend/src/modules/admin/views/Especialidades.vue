<template>
    <div>
        <!--MODAL NUEVO ESPECIALIDAD-->
        <div class="modal fade bd-example-modal-lg" id="my_modal" data-bs-backdrop="static" role="dialog">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Registrar nueva especialidad</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" ref="cerrar_modal_new"></button>
                    </div>

                    <div class="modal-body">
                        <div class="row">
                            <div class="col">
                                <label for="primer_apellido">Descripción Especialidad <label style="color: red">*</label></label>
                                <input v-model="new_especialidad_desc" type="text" class="form-control">
                            </div>
                        </div>
                        <br>
                        <div class="row">
                            <div class="col-sm-6">
                                <label for="primer_apellido">Costo de consulta <label style="color: red">*</label></label>
                                <input v-model="new_especialidad_costo" type="number" class="form-control">
                            </div>

                            <div class="col-sm-6">
                                <label for="primer_apellido">Impuesto a aplicar<label style="color: red">*</label></label>
                                <select v-model="new_especialidad_iva" class="form-select">
                                    <option value=10 selected>10 %</option>
                                    <option value=5 selected>5 %</option>
                                    <option value=0>0 %</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button class="btn btn-danger" data-bs-dismiss="modal">Cancelar</button>
                        <button class="btn btn-success" @click="registrar_especialidad" v-show="!boton_registrar_bandera">Registrar</button>

                        <button class="btn btn-success" type="button" disabled v-show="boton_registrar_bandera">
                            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            Registrando...
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#my_modal" ref="hola" style="display: none;">
            boton oculto
        </button>
        <!--FIN MODAL-->

        <!--MODAL ACTUALIZAR-->
        <div class="modal fade bd-example-modal-lg" id="modificar_especialidad" data-bs-backdrop="static" role="dialog">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Modificar especialidad</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" ref="cerrar_modal_modificar"></button>
                    </div>

                    <div class="modal-body">
                        <div class="row">
                            <div class="col">
                                <label for="primer_apellido">Descripción Especialidad <label style="color: red">*</label></label>
                                <input v-model="old_especialidad_desc" type="text" class="form-control">
                            </div>
                        </div>
                        <br>
                        <div class="row">
                            <div class="col-sm-6">
                                <label for="primer_apellido">Costo de consulta <label style="color: red">*</label></label>
                                <input v-model="old_especialidad_costo" type="number" class="form-control">
                            </div>

                            <div class="col-sm-6">
                                <label for="primer_apellido">Impuesto a aplicar<label style="color: red">*</label></label>
                                <select v-model="old_especialidad_iva" class="form-select">
                                    <option value=10 selected>10 %</option>
                                    <option value=5 selected>5 %</option>
                                    <option value=0>0 %</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button class="btn btn-danger" data-bs-dismiss="modal">Cancelar</button>
                        <button class="btn btn-info text-white" @click="modificar_especialidad" v-show="!boton_modificar_bandera">Modificar</button>

                        <button class="btn btn-info text-white" type="button" disabled v-show="boton_modificar_bandera">
                            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            Modificando...
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modificar_especialidad" ref="boton_modificar" style="display: none;">
            boton oculto
        </button>
        <!--FIN MODAL-->
        
        <nav class="navbar" style="background: #c6c6c6">
            <div style="margin-left: 15px; margin-top: 7px; height: 30px">
                <strong>Configuaración de Especialidades</strong>
            </div>

            <div class="d-flex flex-row align-items-center justify-content-center">
                <button class="btn btn-success" style="margin-right: 12px" @click="nueva_especialidad">
                    <i class="fas fa-plus"></i>&nbsp;&nbsp;&nbsp;Nueva Especialidad
                </button>

                <div class="form-group" style="margin-right: 12px">
                    <input type="text" class="form-control" id="buscador" style="width: 225px" placeholder='&#x1F50E;&#xFE0E; Realiza una búsqueda aquí' v-model="filtro">
                </div>

                <button class="btn btn-danger " @click="regresar_atras" style="margin-right: 12px;">
                    IR A INICIO
                </button>
            </div>
        </nav>

        <div class="contendor_tabla">
            <VueGoodTable
                :columns="columns"
                :rows="especialidades"
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
                    <span v-if="props.column.field === 'controles'">
                        <button class="btn btn-info text-white boton" @click="modificar(props.row.id_especialidad)"><i class="fas fa-pencil-alt"></i>&nbsp;&nbsp;Modificar</button>
                        <button class="btn btn-danger boton" @click="eliminar(props.row.id_especialidad, props.row.descripcion)"><i class="fas fa-trash-alt"></i>&nbsp;&nbsp;Eliminar</button>
                    </span>

                    <span v-else-if="props.column.field === 'precio'">
                        <span>{{new Intl.NumberFormat('es-CL').format(props.row.precio) + ' GS.'}}</span>
                    </span>

                    <span v-else-if="props.column.field === 'porc_iva'">
                        <span>{{props.row.porc_iva + ' %'}}</span>
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
import authApi from '@/api/authApi'
import {mapGetters} from 'vuex'
import Swal  from 'sweetalert2'
import { VueGoodTable } from 'vue-good-table-next';
import 'vue-good-table-next/dist/vue-good-table-next.css'

export default {
    created(){
        document.title = 'Especialidades'
    },

    components: {
        VueGoodTable
    },

   data(){
        return {
            especialidades: [],
            texto_tabla: null,

            new_especialidad_costo: null,
            new_especialidad_desc: null,
            new_especialidad_iva: 10,

            old_especialidad_costo: null,
            old_especialidad_desc: null,
            old_especialidad_iva: null,
            old_especialidad_id: null,

            filtro: null,

            boton_modificar_bandera: false,
            boton_registrar_bandera: false,

            columns: [
                {
                    label: 'Descripción Especialidad',
                    field: 'descripcion'
                },
                {
                    label: 'Costo por consulta',
                    field: 'precio'
                },
                {
                    label: 'Impuesto Aplicado',
                    field: 'porc_iva'
                },
                {
                    label: 'Controles',
                    field: 'controles'
                },
            ]
        }
   },

   methods: {
        async registrar_especialidad(){
            if(!this.new_especialidad_costo || !this.new_especialidad_desc) {
                Swal.fire({
                    html: `<h4>Debe completar todos los campos requeridos</h4>`,
                    icon: 'error'
                })

            } else if (isNaN(this.new_especialidad_costo)) {
                Swal.fire({
                    html: `<h4>Debe ingresar un importe válido</h4>`,
                    icon: 'error'
                })

            } else if (this.new_especialidad_costo <= 0) {
                Swal.fire({
                    html: `<h4>Debe ingresar un importe mayor a 0</h4>`,
                    icon: 'error'
                })

            } else {
                authApi.defaults.headers.common['Authorization'] = `Bearer ${this.accessToken}`
                this.boton_registrar_bandera = true
                await new Promise(resolve => setTimeout(resolve, 500));
                const {data} = await authApi.post('/obtener_especialidades', {
                    descripcion: this.new_especialidad_desc,
                    costo: this.new_especialidad_costo,
                    iva: this.new_especialidad_iva
                })

                this.boton_registrar_bandera = false

                if(+data.id === 0) {
                    Swal.fire({
                        html: `<h4>${data.msg}</h4>`,
                        icon: 'success'
                    }).then(() => {
                        this.$refs.cerrar_modal_new.click()
                        this.new_especialidad_desc = null
                        this.new_especialidad_desc = null
                        this.new_especialidad_iva = 10
                        this.get_especialidad()
                    })
                } else {
                    Swal.fire({
                        html: `<h4>${data.msg}</h4>`,
                        icon: 'error'
                    })
                }
            }
        },

        async modificar_especialidad(){
            if(!this.old_especialidad_costo || !this.old_especialidad_desc) {
                Swal.fire({
                    html: `<h4>Debe completar todos los campos requeridos</h4>`,
                    icon: 'error'
                })

            } else if (isNaN(this.old_especialidad_costo)) {
                Swal.fire({
                    html: `<h4>Debe ingresar un importe válido</h4>`,
                    icon: 'error'
                })

            } else if (this.old_especialidad_costo <= 0) {
                Swal.fire({
                    html: `<h4>Debe ingresar un importe mayor a 0</h4>`,
                    icon: 'error'
                })

            } else {
                this.boton_modificar_bandera = true;
                await new Promise(resolve => setTimeout(resolve, 500));
                authApi.defaults.headers.common['Authorization'] = `Bearer ${this.accessToken}`
                const {data} = await authApi.put('/obtener_especialidades', {
                    descripcion: this.old_especialidad_desc,
                    costo: this.old_especialidad_costo,
                    iva: this.old_especialidad_iva,
                    id: this.old_especialidad_id
                })

                this.boton_modificar_bandera = false;
                this.$refs.cerrar_modal_modificar.click()

                if(+data.id === 0) {
                    Swal.fire({
                        html: `<h4>${data.msg}</h4>`,
                        icon: 'success'
                    }).then(() => {
                        this.get_especialidad()
                    })
                } else {
                    Swal.fire({
                        html: `<h4>${data.msg}</h4>`,
                        icon: 'error'
                    })
                }
            }
        },

        nueva_especialidad (){
            this.$refs.hola.click()
        },

        regresar_atras(){
            this.$router.push({path: '/'})
        },

        async get_especialidad(){
            this.especialidades = []
            this.texto_tabla = 'Cargando especialidades... Espere por favor'
            try {
                const {data} = await authApi.get('/obtener_especialidades', {
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`
                    }
                })

                this.especialidades = data
            } catch (error) {
                console.log(error)
            }

            this.texto_tabla = 'No hay registros'
        },

        eliminar(id, nombre){
            Swal.fire({
            html: `<div style="font-size: 22px">¿Desea eliminar la especialidad <br><strong>${nombre}</strong>?</div>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancelar'

            }).then((result) => {
                if (result.isConfirmed) {
                    this.eliminar_bd(id);
                }
            })
        },

        async eliminar_bd(id) {
            authApi.defaults.headers.common['Authorization'] = `Bearer ${this.accessToken}`
            const {data} = await authApi.delete('/obtener_especialidades?id=' + id)

            if(+data.id === 0) {
                    Swal.fire({
                        html: `<h4>${data.msg}</h4>`,
                        icon: 'success'
                    }).then(() => {
                        this.$refs.cerrar_modal_new.click()
                        this.get_especialidad()
                    })

            } else {
                Swal.fire({
                    html: `<h4>${data.msg}</h4>`,
                    icon: 'error'
                })
            }
        },

        async modificar(id){
            const valor = this.especialidades.filter((item) => item.id_especialidad === +id)
            const esp = valor[0]

            this.old_especialidad_costo = esp.precio
            this.old_especialidad_iva = esp.porc_iva
            this.old_especialidad_desc = esp.descripcion
            this.old_especialidad_id = id

            this.$refs.boton_modificar.click()
        }
   },

   computed:{
        ...mapGetters('auth', ['accessToken'])
   },

   async mounted(){
        await this.get_especialidad();
        /*const function_eliminar = this.eliminar;
        const function_modificar = this.modificar;

        $(document).ready(function(){
                let tabla = $('#tabla').dataTable({
                    responsive: true,
                    destroy: true,
                    language: {
                        url: "//cdn.datatables.net/plug-ins/1.10.11/i18n/Spanish.json"
                    },
                    fixedColumns: true,
                    pageLength: 8,
                    lengthChange: false,
                    searching: true,
                    searchDelay: 0,
                    dom: 'lrtip',
                    order: [],
                    columns:[
                        {"className": "dt-center", "targets": "_all"},
                        {"className": "dt-center", "targets": "_all"},
                        {"className": "dt-center", "targets": "_all"},
                        {
                            className: 'dt-center', 
                            title: 'Controles',
                            orderable: false,
                            searchable: false,
                            //wrap: true, 
                            render: function () {
                                return `
                                        <button class="btn btn-info text-white boton_modificar"><i class="fas fa-pencil-alt"></i>&nbsp;&nbsp;Modificar</button>
                                        <button class="btn btn-danger boton_eliminar"><i class="fas fa-trash-alt"></i>&nbsp;&nbsp;Eliminar</button>`
                            }
                        }
                    ]
                }).api();

                $('#buscador').on('keyup change', function(){
                    tabla.search($(this).val()).draw();
                });

                $(".boton_eliminar").click(function(){
                    function_eliminar($(this).parents("tr")[0].id, $(this).parents("tr").find("td").eq(0).html());
                });

                $(".boton_modificar").click(function(){
                    function_modificar($(this).parents("tr")[0].id);
                });
            });*/
    }
}
</script>

<style scoped>
    .contendor_tabla{
        padding: 15px 150px 0px 150px;
    }
</style>