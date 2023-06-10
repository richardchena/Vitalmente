<template>
    <div>
        <nav class="navbar" style="background: #c6c6c6">
            <div style="margin-left: 15px; margin-top: 7px; height: 30px">
                <strong>Turnos agendados</strong>
            </div>
            <div style="position: absolute; margin-left: 180px">
                <VueDatePicker 
                    v-model="fecha"
                    placeholder="Ingrese una fecha"
                    locale="es-PY"
                    :enable-time-picker="false"
                    :min-date="new Date()"
                    :disabled-week-days="[0]"
                    :format="formato_fecha"
                    week-start="0"
                    :day-names="dias_semana"
                    select-text="OK"
                    cancel-text="Cancelar"
                    :markers="marcadores"
                    :disabled-dates="dias_desactivados"
                    hide-offset-dates
                    :clearable="false"
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

                <div style="margin-left: -210px;">
                    <select v-model="selectProfesional" class="form-select" @change="cambiar_profesional">
                        <option 
                            v-for="item in profesionales" 
                            :key="item.id"
                            :value="item.id"
                        >
                            {{item.nombre}}
                        </option>
                    </select>
                </div>

                <div style="margin-left: -490px;">
                    <button class="btn btn-success " @click="ver_todos">
                        VER TODAS
                    </button>
                </div>


            <div class="d-flex flex-row align-items-center justify-content-center">
                <div class="d-flex flex-row align-items-center justify-content-center">
                    <div style="margin-right: 10px">
                        <button class="btn btn-danger " @click="regresar_atras">
                            IR A INICIO
                        </button>
                    </div>
                </div>
            </div>
        </nav>

        <div class="contenedor" style="margin-top: 10px;">
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
            >
                <template #emptystate>
                    <div class="text-center">{{texto_tabla}}</div>
                </template>
            </VueGoodTable>
        </div>
    </div>
</template>

<script>
import authApi from '@/api/authApi'
import VueDatePicker from '@vuepic/vue-datepicker';
import { mapGetters} from 'vuex'
import '@vuepic/vue-datepicker/dist/main.css'

import 'bootstrap';
import format from 'date-fns/format';

import { VueGoodTable } from 'vue-good-table-next';
import 'vue-good-table-next/dist/vue-good-table-next.css'

export default {
    data(){
        return {
            fecha: this.$route.query.fecha,
            fecha_fin: null,
            dias_semana: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
            marcadores: [],
            dias_desactivados: [],
            datos: [],
            fecha_filtro: null,

            profesionales: [{id: 0, nombre: '--SELECCIONA UN PROFESIONAL--'}], 
            selectProfesional: this.$route.query.cod || 0,

            texto_tabla: null,

            columns: [
                {
                    label: 'Nro. Reserva',
                    field: 'id_cita'
                },
                {
                    label: 'Fecha Reserva',
                    field: 'fecha_reserva'
                },
                {
                    label: 'Paciente',
                    field: 'paciente'
                },
                {
                    label: 'Fecha Turno',
                    field: 'fecha_turno'
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
                    label: 'Estado',
                    field: 'estado_cita'
                },
            ]
        }
    },

    computed:{
        ...mapGetters('auth', ['accessToken']),
    },

    async created(){
        await this.obtener_feriados();
        await this.obtener_lista_profs();
    },

    components: {
        VueDatePicker,
        VueGoodTable
    },

    watch:{
        async fecha(){
            if(this.fecha) {
                this.fecha_filtro = format(this.fecha, 'yyyy/MM/dd')//'dd/MM/yyyy')

                if(!this.$route.query.cod){
                    await this.$router.replace({query: { fecha: this.fecha_filtro }})
                } else {

                    let prueba = 0;
                    
                    for (let i = 0; i < this.profesionales.length; i++) {
                        if(this.profesionales[i].id === +this.$route.query.cod){
                            prueba = this.profesionales[i].id
                        }
                    }


                    await this.$router.replace({query: { fecha: this.fecha_filtro, cod: prueba}})
                }
                
                //this.$router.go(0);
                this.obtener_lista()
            }
        },
    },

    methods: {
        async ver_todos(){
            await this.$router.replace({query: {}})
            this.obtener_lista()
        },

        async cambiar_profesional(){
            //if(this.$route.query.cod || this.$route.query.fecha === 0 || this.$route.query.cod === '0') {
                if(!this.$route.query.fecha){
                    await this.$router.replace({query: { cod: this.selectProfesional }})
                } else {
                    await this.$router.replace({query: { fecha: this.$route.query.fecha, cod: this.selectProfesional}})
                }
                
                this.obtener_lista()
                //this.$router.go(0);
            //}
        },

        regresar_atras(){
            this.$router.push({ path: '/' });
        },

        formato_fecha (date) {
            const day = date.getDate();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();

            return `${day}/${month}/${year}`;
        },

        async obtener_lista(){
            this.datos = []
            this.texto_tabla = 'Cargando datos... Espere por favor'
            //await new Promise(resolve => setTimeout(resolve, 1000));

            let obj = {}

            if(!this.$route.query.cod && this.$route.query.fecha) {
                obj.fecha = this.$route.query.fecha

            } else if (this.$route.query.cod && !this.$route.query.fecha) {
                obj.cod = this.$route.query.cod

            } else if (this.$route.query.cod && this.$route.query.fecha) {
                obj.fecha = this.$route.query.fecha
                obj.cod = this.$route.query.cod
            }

            console.log(obj)

            const {data} = await authApi.get('/reservas/agendas/admin', {
                params: obj,
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })

            this.datos = data
            this.texto_tabla = 'No hay registros para mostrar'
        },

        async obtener_lista_profs(){
            /*let obj = {};

            if(this.$route.query.fecha){
                obj.fecha = this.$route.query.fecha
            }*/

            const {data} = await authApi.get('/reservas/agendas/admin/distinct', {
                //params: obj,
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })
            for (let i = 0; i < data.length; i++) {
                this.profesionales.push(data[i])
            }
        },

        async obtener_feriados(){
            const {data} = await authApi.get('/obtener_feriados', {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })

            for (let j = 0 ; j < data.length ; j++) {
                let obj =  {};
                obj.date = new Date(data[j].anho,data[j].mes-1,data[j].dia);
                obj.type = 'line';
                obj.tooltip = [{ text: data[j].motivo }]
                
                this.dias_desactivados.push(obj.date);
                this.marcadores.push(obj);
            }
        },
    },

    async mounted(){
        await this.obtener_lista()
    }
}
</script>

<style>
 .contenedor{
    padding: 10px;
 }
</style>