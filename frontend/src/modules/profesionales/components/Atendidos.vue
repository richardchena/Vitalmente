<template>
    <div>
        <div class="contendor_tabla">
            <div class="d-flex flex-row-reverse" style="margin-bottom: 10px;">
                <div class="form-group">
                    <input v-model="filtro" type="text" class="form-control" id="buscador_atendidos_prof" style="width: 225px" placeholder='&#x1F50E;&#xFE0E; Realiza una búsqueda aquí'>
                </div>
            </div>

            <div class="container" style="margin-top: 10px;">
                <VueGoodTable
                    :columns="columns"
                    :rows="atendidos"
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
                            <button class="btn btn-success" @click="funcion_ir_exp(props.row.nro_exp)"><i class="far fa-file-alt"></i>&nbsp;&nbsp;Ir al historial</button>
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
import authApi from '@/api/authApi'
import { mapGetters} from 'vuex'

import { VueGoodTable } from 'vue-good-table-next';
import 'vue-good-table-next/dist/vue-good-table-next.css'

export default {
    computed:{
        ...mapGetters('auth', ['accessToken', 'username']),
    },

    components: {
        VueGoodTable
    },

    methods: {
        async obtener_id_prof(){
            const {data} = await authApi.get('/profesionales/obtener_id', {
                params: {
                    username: this.username
                },
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })

            this.id_profesional = data.id_profesional
        },

        async obtener_datos_paciente(){
            this.atendidos = []
            this.texto_tabla = 'Cargado lista... Espere por favor'
            const {data} = await authApi.get('/sala_espera/profesional/atendido', {
                params: {
                    id_profesional: this.id_profesional
                },
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })

            this.texto_tabla = 'Aún no se han atendido pacientes hoy'
            this.atendidos = data
        },

        funcion_ir_exp(id){
            let win = window.open('./historial_consultas/' + id, '_blank');
            win.focus();
        }
    },

    data(){
        return{
            id_profesional: null,
            atendidos: [],

            filtro: null,
            texto_tabla: null,

            columns: [
                {
                    label: 'Nro. Reserva',
                    field: 'id_cita'
                },
                {
                    label: 'Cant. Sesiones',
                    field: 'cant_ses'
                },
                {
                    label: 'Paciente',
                    field: 'paciente'
                },
                {
                    label: 'Tipo Doc.',
                    field: 'tipo_doc'
                },
                {
                    label: 'Nro. doc.',
                    field: 'nro_doc'
                },
                {
                    label: 'Especialidad',
                    field: 'especialidad'
                },
                {
                    label: 'Turno',
                    field: 'turno'
                },
                {
                    label: 'Horario',
                    field: 'horario'
                },
                {
                    label: 'Controles',
                    field: 'controles',
                    sortable: false,
                }
            ]

        }
    },

    created(){
        document.title = 'Pacientes Atendidos'
    },

    async mounted(){
        await this.obtener_id_prof();
        await this.obtener_datos_paciente();
    }
}
</script>

<style>
    .contendor_tabla{
        padding: 15px;
    }
</style>