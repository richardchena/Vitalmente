<template>
    <div>
        <div class="contendor_tabla">
            <div class="d-flex flex-row-reverse" style="margin-bottom: 10px;">
                <div class="form-group">
                    <input v-model="filtro" type="text" class="form-control" id="buscador_espera" style="width: 225px" placeholder='&#x1F50E;&#xFE0E; Realiza una búsqueda aquí'>
                </div>
                <select v-model="selectProfesional" class="form-select" style="width: 225px;  margin-right: 15px;" id="selector_prof">
                    <option 
                        v-for="item in profesionales" 
                        :key="item.id"
                        :value="item.id"
                    >
                        {{item.nombre}}
                    </option>
                </select>
                <strong><label style="margin-top: 7px;">Filtrar Profesional:&nbsp;&nbsp;</label></strong>
            </div>
            <hr>

            <div class="container" style="margin-top: 10px;">
                <VueGoodTable
                    :columns="columns"
                    :rows="en_espera"
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
                            <button class="btn btn-engranaje" @click="eliminar(props.row.id_cita, props.row.estado)"><i class="fas fa-cog fa-lg"></i></button>
                        </span>

                        <div v-if="props.column.field == 'estado'" class="text-center">
                            <div v-if="props.row.estado === 'SIENDO ATENDIDO'" class="siendo_atendido">{{props.row.estado}}</div>
                            <div v-else-if="props.row.estado === 'FINALIZADO'" class="finalizado">{{props.row.estado}}</div>
                            <div v-else class="esperando">{{props.row.estado}}</div>
                        </div>

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
import Swal  from 'sweetalert2'
import authApi from '@/api/authApi'
import { mapGetters} from 'vuex'

import { VueGoodTable } from 'vue-good-table-next';
import 'vue-good-table-next/dist/vue-good-table-next.css'

export default {
    computed:{
        ...mapGetters('auth', ['accessToken']),
    },

    watch: {
        selectProfesional(){
            if(this.selectProfesional === 0){
                this.get_distinct_prof()
                this.get_citas()
            } else {
                let filterObj = this.en_espera.filter((item) => item.id_profesional === this.selectProfesional);
                this.en_espera = filterObj

                let filterObjProf = this.profesionales.filter((item) => item.id === this.selectProfesional);
                this.profesionales = []
                this.profesionales.push({id:0, nombre: "--TODOS--"})
                this.profesionales.push({id:this.selectProfesional, nombre: filterObjProf[0].nombre})
            }
        }
    },

    data() {
        return{
            profesionales: [],
            selectProfesional: 0,
            en_espera: [],

            filtro: null,
            texto_tabla: null,

            columns: [
                {
                    label: 'Orden Nro.',
                    field: 'orden'
                },
                {
                    label: 'Nro. Reserva',
                    field: 'id_cita'
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
                    label: 'Profesional',
                    field: 'profesional'
                },
                {
                    label: 'Especialidad',
                    field: 'especialidad'
                },
                {
                    label: 'Horario',
                    field: 'horario'
                },
                {
                    label: 'Estado',
                    field: 'estado'
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

    async created(){
        await this.get_distinct_prof()
    },

    methods:{
        eliminar(id, estado){
            if(estado === 'ESPERANDO') {
                Swal.fire({
                    html: `<h4>¿Desea retirar de la cola de espera la <br>reserva nro. ${id}?</h4>`,
                    icon: 'question',
                    showCancelButton: true,
                    showDenyButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    denyButtonColor: '#f0820d',
                    denyButtonText: 'Sí y cancelar cita',
                    confirmButtonText: 'Solo retirar',
                    cancelButtonText: 'Atrás',
                }).then((result) => {
                    if (result.isConfirmed) {
                        this.sacar(id)
                    } else if (result.isDenied) {
                        this.sacar_admin(id)
                    }
                })
            } else {
                Swal.fire({
                    html: `<h4>Esta opción ya no se puede modificar</h4>`,
                    icon: 'warning',
                })
            }
        },

        async sacar(id){
            authApi.defaults.headers.common['Authorization'] = `Bearer ${this.accessToken}`

            try {
                const {data} = await authApi.delete(`/sala_espera?id_cita=${id}`)
                if(data.id === 0){
                    this.$router.go();
                } else {
                    this.error(':(')
                }

            } catch (e) {
                this.error(e)
            }
        },

        async sacar_admin(id){
            authApi.defaults.headers.common['Authorization'] = `Bearer ${this.accessToken}`

            try {
                const {data} = await authApi.put(`/reservas/agendas/paciente/cancelar_admin?id_cita=${id}`)
                if(data.id === 0){
                    this.$router.go();
                } else {
                    this.error(':(')
                }

            } catch (e) {
                this.error(e)
            }
        },

        error(e){
            Swal.fire({
                html: `<h4>Ocurrio un error inesperado al confirmar la asistencia<br>${e}</h4>`,
                icon: 'error',
            })
        },

        async get_citas(){
            this.en_espera = []
            this.texto_tabla = 'Cargando lista... Por favor espere'
            const {data} = await authApi.get('/sala_espera/en_consultorio', {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })

            this.en_espera = data
            this.texto_tabla = 'No hay pacientes en espera'
        },

        async get_distinct_prof(){
            const {data} = await authApi.get('/sala_espera/distinct/profesionales/citas/consultorio', {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })

            this.profesionales = []
            this.profesionales.push({id:0, nombre: "--TODOS--"})
            for (let i = 0; i < data.length; i++) {
                this.profesionales.push(data[i])
            }
        }
    },

    async mounted(){
        await this.get_citas();
    }
}
</script>

<style>
    .contendor_tabla{
        padding: 15px;
    }

    .esperando{
        background-color: #393939;
        color: white;
        border-radius: 10px;
        font-weight: bold;
    }

    .finalizado{
        background-color: #318443;
        color: white;
        border-radius: 10px;
        font-weight: bold;
    }

    .siendo_atendido{
        background-color: #F89404;
        color: white;
        border-radius: 10px;
        font-weight: bold;
    }
</style>