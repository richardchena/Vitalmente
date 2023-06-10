<template>
   <div>
        <!--MODAL ACTUALIZAR-->
        <div class="modal fade bd-example-modal-lg" id="my_modal" ref="hola" data-bs-backdrop="static" role="dialog">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Actualizar datos del paciente #{{id_user_mod}}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>

                    <div class="modal-body">
                        <FormularioActualizar
                            :id_paciente=id_user_mod
                        />
                    </div>
                </div>
            </div>
        </div>

        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#my_modal" ref="boton" style="display: none;">
            boton oculto
        </button>
        <!--FIN MODAL-->

        <!--PAGINA PRINCIPAL-->
        <div v-if="isLoading" class="spinner-wrapper">
            <div class="spinner-border text-otros">
                <span class="visually-hidden"></span>
            </div>
            <strong style="font-size: 25px; margin-left: 20px; margin-top:15px; color: black"><p>{{msg}}... Aguarde por favor</p></strong>
        </div>

        <nav class="navbar" style="background: #c6c6c6">
            <div style="margin-left: 15px; margin-top: 7px; height: 30px">
                <strong>Lista de pacientes</strong>
            </div>

            <div class="d-flex flex-row align-items-center justify-content-center">
                <button class="btn btn-outline-dark" style="margin-right: 20px" @click="registrar_paciente" v-show="role === 1">
                    <i class="fas fa-user-plus"></i>&nbsp;&nbsp;&nbsp;Alta de Paciente
                </button>

                <div class="form-group" style="margin-right: 12px">
                    <input type="text" class="form-control" id="buscador" style="width: 225px" placeholder='&#x1F50E;&#xFE0E; Realiza una búsqueda aquí' v-model="filtro">
                </div>
            </div>
        </nav>

        <div class="container" style="margin-top: 10px;">
            <VueGoodTable
                :columns="columns"
                :rows="users"
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
                        <button class="btn btn-success boton" title="Reserva" @click="funcion_reserva(props.row.id)"><i class="fas fa-calendar-plus"></i></button>
                        <button class="btn btn-secondary boton" title="Ver expediente" @click="expediente(props.row.id)"><i class="far fa-file-alt"></i></button>
                        <button class="btn btn-info boton" title="Modificar registro" @click="modificar(props.row.id)"><i class="fas fa-pencil-alt"></i></button>
                        <button v-if="props.row.status === 'Activa'" class="btn btn-warning boton" title="Desactivar cuenta" @click="activar_desactivar(props.row.id)"><i class="fas fa-user"></i></button>
                        <button v-else class="btn btn-warning boton" title="Activar cuenta"><i class="fas fa-user-slash" @click="activar_desactivar(props.row.id)"></i></button>
                        <button class="btn btn-danger boton" title="Eliminar" @click="eliminar(props.row.id, props.row.name)"><i class="fas fa-trash-alt"></i></button>
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
import 'bootstrap';
import {defineAsyncComponent} from 'vue'

import { VueGoodTable } from 'vue-good-table-next';
import 'vue-good-table-next/dist/vue-good-table-next.css'

export default {
    components: {
        FormularioActualizar: defineAsyncComponent(() => import ('@/modules/admin/components/EstructuraRegistro')),
        VueGoodTable
    },

    data: function() {
        return {
            filtro: null,
            tabla: null,
            users: [],
            isLoading: false,
            msg: 'Actualizando datos',

            //DATOS DEL MODAL
            id_user_mod: 0,

            texto_tabla: null,

            columns: [
                /*{
                    label: 'Exp.',
                    field: 'id'
                },*/
                {
                    label: 'Nombre Completo',
                    field: 'name'
                },
                {
                    label: 'Tipo Doc.',
                    field: 'tipo_doc'
                },
                {
                    label: 'Nro. Doc.',
                    field: 'nro_doc'
                },
                {
                    label: 'Residencia',
                    field: 'residencia'
                },
                {
                    label: 'Teléfono',
                    field: 'telefono'
                },
                {
                    label: 'Estado Cuenta',
                    field: 'status'
                },
                {
                    label: 'Controles',
                    field: 'controles',
                    sortable: false,
                }
            ]
        }
    },

    computed:{
        ...mapGetters('auth', ['accessToken', 'role'])
    },

    methods: {
        modificar(id){
            this.id_user_mod = +id;
            this.$refs.boton.click();
        },

        async get_pacientes(){
            this.texto_tabla = 'Cargando los datos... Por favor espere'
            this.users = []
            
            try {
                const {data} = await authApi.get('/pacientes', {
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`
                    }
                })
                this.users = data
            } catch (error) {
                console.log(error)
            }

            this.texto_tabla = 'No hay registros disponibles'
        },

        registrar_paciente(){
            if(this.role === 1) this.$router.push({ name: 'registrar-paciente-admin' })
            else this.$router.push({ name: 'registrar-paciente-prof' })
        },

        expediente(id){
            if(this.role === 1) this.$router.push({ name: 'historial-consultas-admin', params: { id } })
            else this.$router.push({ name: 'historial-consultas-prof', params: { id } })
            
        },

        eliminar(id_paciente, nombre){
            Swal.fire({
            html: `<h4>¿Eliminar al paciente #${id_paciente} ${nombre}?</h4>`,
            //text: "¡Esta acción no se puede deshacer!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancelar'

            }).then((result) => {
                if (result.isConfirmed) {
                    this.eliminar_bd(id_paciente);
                }
            })
        },

        async eliminar_bd(id){
            this.msg = 'Eliminando el usuario'
            authApi.defaults.headers.common['Authorization'] = `Bearer ${this.accessToken}`

            try {
                this.isLoading = true;
                authApi.delete(`/pacientes/eliminar_paciente/${id}`)
                await new Promise(resolve => setTimeout(resolve, 1000));

                this.get_pacientes();
                this.isLoading = false;

            } catch (error) {
                this.isLoading = false;
                console.log(error)
            }
        },

        async activar_desactivar(id_paciente){
            this.msg = 'Actualizando estado del usuario'
            authApi.defaults.headers.common['Authorization'] = `Bearer ${this.accessToken}`

            try {
                this.isLoading = true;
                await authApi.post(`/pacientes/cambiar_estado/${id_paciente}`)
                await new Promise(resolve => setTimeout(resolve, 1000));
                this.get_pacientes()
                this.isLoading = false;

            } catch (error) {
                this.isLoading = false;
                console.log(error)
            }
        },

        funcion_reserva(id){
            if(this.role === 1) {
                //window.location.href = './reserva/' + id
                this.$router.push({ name: 'reserva-cita', params: { id_paciente: id } })//.then(() => { this.$router.go() })
            }
            else {
                this.$router.push({ name: 'reserva-cita-prof', params: { id_paciente: id } })//.then(() => { this.$router.go() })
            }
        }
    },

    created(){
        document.title = 'Lista de Pacientes'
    },

    async mounted(){
        await this.get_pacientes();
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

    .boton{
        margin-right: 5px;
    }

    .contendor_tabla{
        padding: 15px;
    }

    .spinner-wrapper {
        background-color: gray;
        opacity:0.9;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 9999;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .spinner-border {
        height: 70px;
        width: 70px;
    }

    .text-otros {
        font-size: 30px;
    }
</style>