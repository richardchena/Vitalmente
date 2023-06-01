<template>
    <div>
        <nav class="navbar" style="background: transparent">
            <div style="margin-left: 40px; margin-top: 25px; height: 30px; width: 600px;">
                <div class="row" style="margin-right: auto;">
                    <div class="col" style="margin-left: 10px;">
                        <label style="font-size: 25px;">
                            <i class="far fa-calendar-alt fa-lg"></i><strong>&nbsp;&nbsp; Citas y Consultas</strong>
                        </label>
                    </div>

                    <div class="col" style="margin-right: 70px;">
                        <VueDatePicker 
                            v-model="fecha_seleccion"
                            locale="es-PY"
                            :max-date="fin_mes"
                            select-text="OK"
                            cancel-text="Cancelar"
                            :clearable="true"
                            placeholder="Seleccione un periodo"
                            month-picker
                            required 
                        />
                    </div>
                </div>


            </div>
        </nav>

        <div class="container columna" style="width: 95%;">
            <div class="row ">
                <div class="col-5">
                    <label style="font-weight: bold; margin-left: 15px; margin-bottom: 10px; margin-top: 10px;">
                        Citas
                    </label>

                    <br>

                    <ul style="margin-left: 25px;">
                        <li><strong><i>Calendarizadas:</i></strong><strong style="margin-left: 39px">{{ pacientes.en_curso }}</strong></li>
                        <li>Asistidas:<strong style="margin-left: 98px">{{ pacientes.asistidas }}</strong></li>
                        <li>Ausencias:<strong style="margin-left: 90px">{{ pacientes.ausencias }}</strong></li>
                        <li>Canceladas:<strong style="margin-left: 80px">{{ pacientes.canceladas }}</strong></li>
                    </ul>
                </div>

                <div class="col-2 text-center" style="width: 10%;">
                    <div class="vertical-line"></div>
                </div>

                <div class="col-5">
                    <label style="font-weight: bold; margin-left: -5px; margin-bottom: 10px; margin-top: 10px;">
                        Consultas
                    </label>

                    <br>

                    <ul style="margin-left: 5px;">
                        <li><strong><i>En curso:</i></strong><strong style="margin-left: 121px">{{ pacientes.en_curso_consulta }}</strong></li>
                        <li>Finalizadas sin cobrar:<strong style="margin-left: 45px">{{ pacientes.sin_cobrar }}</strong></li>
                        <li>Finalizadas y cobradas:<strong style="margin-left: 37px">{{ pacientes.cobradas }}</strong></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
import authApi from '@/api/authApi'
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import endOfMonth from 'date-fns/endOfMonth';
import format from 'date-fns/format';

export default {
    components: {
        VueDatePicker
    },

    created(){
        this.get_lista_citas()
        this.get_lista_consultas()
    },

    computed:{
        ...mapGetters('auth', ['accessToken']),
    },

    watch: {
        async fecha_seleccion(){
            await this.get_lista_citas()
            await this.get_lista_consultas()
        }
    },

    methods: {
        async get_lista_citas(){
            this.pacientes.en_curso = '0'
            this.pacientes.asistidas = '0'
            this.pacientes.canceladas = '0'
            this.pacientes.ausencias = '0'

            const {data} = await authApi.get('/reports/total_citas', {
                params: {
                    mes: this.fecha_seleccion ? this.fecha_seleccion.month + 1 : undefined,
                    anho: this.fecha_seleccion ? this.fecha_seleccion.year : undefined
                },
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })

            for (var i = 0; i < data.length; i++) {
                if (data[i].categ_citas === 'PENDIENTES') this.pacientes.en_curso = data[i].cantidad
                if (data[i].categ_citas === 'ASISTIDAS') this.pacientes.asistidas = data[i].cantidad
                if (data[i].categ_citas === 'CANCELADOS') this.pacientes.canceladas = data[i].cantidad
                if (data[i].categ_citas === 'AUSENTES') this.pacientes.ausencias = data[i].cantidad
            }
        },

        async get_lista_consultas(){
            this.pacientes.en_curso_consulta = '0'
            this.pacientes.sin_cobrar = '0'
            this.pacientes.cobradas = '0'

            const {data} = await authApi.get('/reports/total_consultas', {
                params: {
                    mes: this.fecha_seleccion ? this.fecha_seleccion.month + 1 : undefined,
                    anho: this.fecha_seleccion ? this.fecha_seleccion.year : undefined
                },
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })

            for (var i = 0; i < data.length; i++) {
                if (data[i].tipo === 'EN CURSO') this.pacientes.en_curso_consulta = data[i].cantidad
                if (data[i].tipo === 'FINALIZADAS') this.pacientes.cobradas = data[i].cantidad
                if (data[i].tipo === 'PENDIENTES') this.pacientes.sin_cobrar = data[i].cantidad
            }
        },
    },

    data(){
        return {
            pacientes: {
                en_curso: '0',
                ausencias: '0',
                asistidas: '0',
                canceladas: '0',

                en_curso_consulta: '0',
                sin_cobrar: '0',
                cobradas: '0'
            },

            fin_mes: endOfMonth(new Date()),
            fecha_seleccion: { "month": format(new Date(), 'MM') - 1, "year": +format(new Date(), 'yyyy') },
        }
    }

}
</script>

<style scoped>
    .columna{
        border: 1px solid; 
        border-radius: 10px; 
        background-color: #e1dede; 
        margin-top: 10px;

    }

    div.vertical-line{
      width: 1px; 
      background-color: black;
      height: 100%;
      display: inline-block;
    }
</style>