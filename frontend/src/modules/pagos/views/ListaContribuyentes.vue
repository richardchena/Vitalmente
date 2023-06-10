<template>
    <div>
        <nav class="navbar" style="background: #c6c6c6">
            <div style="margin-left: 15px">
                <strong>Contribuyentes</strong>
            </div>

            <div class="d-flex flex-row align-items-center justify-content-center">
                <button class="btn btn-outline-dark" style="margin-right: 15px" @click="nuevo_contribuyente">
                    <i class="fas fa-plus-circle"></i>&nbsp;&nbsp;&nbsp;Nuevo
                </button>

                <div class="form-group" style="margin-right: 12px">
                    <input type="text" class="form-control" id="buscador" style="width: 225px" placeholder='&#x1F50E;&#xFE0E; Realiza una búsqueda aquí'>
                </div>
            </div>
        </nav>

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
                        <button class="btn btn-info boton" @click="modificar(props.row.id)"><i class="fas fa-pencil-alt"></i></button>
                        <button class="btn btn-danger boton" @click="eliminar(props.row.id)"><i class="fas fa-trash-alt"></i></button>
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

import { VueGoodTable } from 'vue-good-table-next';
import 'vue-good-table-next/dist/vue-good-table-next.css'

export default {
    computed:{
        ...mapGetters('auth', ['accessToken'])
    },

    components: {
        VueGoodTable
    },

    data() {
        return{
            filtro: null,
            datos: [],
            texto_tabla: null,
            columns: [
                {
                    label: 'Razón Social',
                    field: 'razon'
                },
                {
                    label: 'Alias',
                    field: 'alias'
                },
                {
                    label: 'Tipo Persona',
                    field: 'tipo'
                },
                {
                    label: 'R.U.C.',
                    field: 'ruc'
                },
                {
                    label: 'Actividad Económica',
                    field: 'act'
                },
                {
                    label: 'Ubicación',
                    field: 'ubi'
                },
                {
                    label: 'Controles',
                    field: 'controles',
                    sortable: false
                },
            ]
        }   
    },

    created() {
        document.title = 'Contribuyentes'
        this.get_datos();
    },

    methods: {
        nuevo_contribuyente(){
            this.$router.push({name: 'contribuyente'})
        },

        async get_datos(){
            this.datos = []
            this.texto_tabla = 'Cargando lista... Espere por favor'
            const {data} = await authApi.get('/pagos/contribuyente', {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })

            this.datos = data
            this.texto_tabla = 'No hay informacion disponible'
        },

        eliminar(id){
            Swal.fire({
            html: "<h4>¿Desea dar de baja el contribuyente?</h4>",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancelar'})
            .then((result) => {
                if (result.isConfirmed) {
                    this.eliminar_db(id)
                }
            })
        },

        async eliminar_db(id){
            authApi.defaults.headers.common['Authorization'] = `Bearer ${this.accessToken}`

            try {
                const {data} = await authApi.delete(`/pagos/contribuyente?id=${id}`)
                if (data.id === 0){
                    this.$router.go();
                } else {
                    Swal.fire({
                    html: "<h4>Hubo un error inesperado</h4>",
                    icon: 'error'})
                }
            } catch (error) {
                Swal.fire({
                html: "<h4>Hubo un error inesperado</h4>",
                icon: 'error'})
            }
        },
        
        modificar(id){
            this.$router.push({name: 'modificar-contribuyente', params: {id}})
        }
    },
}
</script>

<style scoped>
    .contendor_tabla{
        padding: 15px 50px 15px 50px;
    }
</style>