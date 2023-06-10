<template>
    <div>
        <div class="contendor_tabla">
            <div class="d-flex flex-row-reverse" style="margin-bottom: 10px;">
                <div class="form-group">
                    <input v-model="filtro" type="text" class="form-control" id="buscador_hoy" style="width: 225px" placeholder='&#x1F50E;&#xFE0E; Realiza una búsqueda aquí'>
                </div>
                <select v-model="selectProfesional" class="form-select" style="width: 225px;  margin-right: 15px;" id="selector_prof_hoy">
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
                    :rows="reservas"
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
                            <button class="btn btn-success" @click="confirmar(props.row.id_cita, props.row.paciente)"><i class="fas fa-check"></i>&nbsp;&nbsp;Confirmar asistencia</button>
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
import format from 'date-fns/format';
import authApi from '@/api/authApi'
import { mapGetters} from 'vuex'
import Swal  from 'sweetalert2'

import { VueGoodTable } from 'vue-good-table-next';
import 'vue-good-table-next/dist/vue-good-table-next.css'

export default {
    async created(){
        document.title = 'Sala de Espera'
        await this.get_distinct_prof()

    },

    components: {
        VueGoodTable
    },

    watch: {
        selectProfesional(){
            if(this.selectProfesional === 0){
                this.get_distinct_prof()
                this.get_citas()
            } else {
                let filterObj = this.reservas.filter((item) => item.id_profesional === this.selectProfesional);
                this.reservas = filterObj

                let filterObjProf = this.profesionales.filter((item) => item.id === this.selectProfesional);
                this.profesionales = []
                this.profesionales.push({id:0, nombre: "--TODOS--"})
                this.profesionales.push({id:this.selectProfesional, nombre: filterObjProf[0].nombre})
            }
        }
    },

    computed:{
        ...mapGetters('auth', ['accessToken']),
    },

    data(){
        return{
            profesionales: [],
            selectProfesional: 0,
            hoy: format(new Date(), 'dd/MM/yyyy'),
            reservas: [],
            texto_tabla: null,
            filtro: null,
            copia_original: null,

            columns: [
                {
                    label: 'Nro. Reserva',
                    field: 'id_cita'
                },
                /*{
                    label: 'Nro. Expediente',
                    field: 'nro_exp'
                },*/
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
                    label: 'Controles',
                    field: 'controles',
                    sortable: false,
                }
            ]
        }
    },

    methods: {
        confirmar(id_cita, nombre){
            Swal.fire({
                html: `<h4>¿Desea confirmar la asistencia de ${nombre}?</h4>`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Confirmar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.registrar(id_cita)
                }
            })
        },

        async registrar(id){
            authApi.defaults.headers.common['Authorization'] = `Bearer ${this.accessToken}`

            try {
                const {data} = await authApi.post(`/sala_espera?id_cita=${id}`)
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
            this.reservas = []
            this.texto_tabla = 'Cargando datos... Espere por favor'
            const {data} = await authApi.get('/sala_espera', {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })

            this.reservas = data
            this.texto_tabla = 'No hay pacientes con reserva para el día de hoy'
        },

        async get_distinct_prof(){
            const {data} = await authApi.get('/sala_espera/distinct/profesionales/citas/dia', {
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
        await this.get_citas()
    }
}
</script>

<style>
    table{
        background-color: #ededed;
        /*text-align: center;*/
        width:100%;
        font-family: SF Pro Display sans-serif;
    }

    .contendor_tabla{
        padding: 15px;
    }

    input[type="checkbox"]{
        margin-top: 0px;
        height: 24px;
        width: 24px;
        border: none;
    }

    input[type="checkbox"]:checked{
        background-color: #198754;
        border: none;
    }

    input[type="checkbox"]:focus{
        box-shadow: none !important;
    }

    .dataTables_wrapper .dataTables_filter input {
        width: 250px;
        height: 40px;
        background: white;
        border-radius: 5px;
    }

    .dataTables_wrapper .dataTables_filter input:focus {
        box-shadow: inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(102,175,233,.6);
        outline: none;
    }
</style>