<template>
    <div>
        <div class="contendor_tabla">
            <div class="d-flex flex-row-reverse" style="margin-bottom: 10px;">
                <div class="form-group">
                    <input type="text" class="form-control" id="buscador_espera_prof" style="width: 225px" placeholder='&#x1F50E;&#xFE0E; Realiza una búsqueda aquí'>
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
                            <button class="btn btn-success" @click="funcion_iniciar(props.row.id_cita)"><i class="fas fa-play"></i>&nbsp;&nbsp;Iniciar atención</button>
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
import Swal  from 'sweetalert2'

import { VueGoodTable } from 'vue-good-table-next';
import 'vue-good-table-next/dist/vue-good-table-next.css'

export default {
    created(){
        document.title = 'Pacientes en espera'
    },

    data(){
        return{
            id_profesional: null,
            atendidos: [],
            bandera: false,

            filtro: null,
            texto_tabla: null,

            columns: [
                {
                    label: 'Orden',
                    field: 'orden'
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
                    label: 'Cant. Sesiones',
                    field: 'cant_ses'
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

    components: {
        VueGoodTable
    },

    computed:{
        ...mapGetters('auth', ['accessToken', 'username']),
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

        async verificar_consulta_curso(){
            const {data} = await authApi.get('/sala_espera/profesional/verificar_consulta_curso', {
                params: {
                    id_profesional: this.id_profesional
                },
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })

            if(+data.cantidad === 0){
                this.bandera = true;
            }
        },

        async get_citas(){
            await this.obtener_id_prof();
            if(this.id_profesional){
                this.atendidos = []
                this.texto_tabla = 'Cargando lista... Por favor espere'
                const {data} = await authApi.get(`/sala_espera/profesional/espera?id_profesional=${this.id_profesional}`, {
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`
                    }
                })

                this.texto_tabla = 'No hay pacientes en espera'
                this.atendidos = data
            }

        },

        async confirmar_inicio(id){
            authApi.defaults.headers.common['Authorization'] = `Bearer ${this.accessToken}`

            try {
                const {data} = await authApi.post(`/sala_espera/profesional/iniciar_cita?id_cita=${id}`)
                if(data.id === 0) {
                    this.$router.push({name: 'atencion-curso-prof'})
                } else {
                    this.error(':(')
                }

            } catch (error) {
                this.error(error)
            }
        },

        error(er){
            console.log(er)
            Swal.fire({
                html: `<h4>Ha ocurrido un error inesperado</h4>`,
                icon: 'error'
            })
        },

        funcion_iniciar(id){
            if(this.bandera){
                Swal.fire({
                    html: `<h4>¿Desea iniciar esta cita?</h4>`,
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancelar'

                }).then((result) => {
                    if (result.isConfirmed) {
                        this.confirmar_inicio(id);
                    }
                })

            } else {
                Swal.fire({
                    html: `<h4>Favor primero finalice la consulta en curso</h4>`,
                    icon: 'error'
                })
            }

        },
    },

    async mounted(){
        await this.get_citas();
        await this.verificar_consulta_curso();
    }
}
</script>

<style>
    .contendor_tabla{
        padding: 15px;
    }
</style>