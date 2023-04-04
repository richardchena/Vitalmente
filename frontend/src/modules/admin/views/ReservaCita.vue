<template>
    <div>
        <nav class="navbar" style="background: #c6c6c6">
            <div style="margin-left: 15px; margin-top: 7px; height: 30px">
                <strong>Reservar nueva cita</strong>
            </div>
            <div class="d-flex flex-row align-items-center justify-content-center">
                <div class="d-flex flex-row align-items-center justify-content-center">
                    <div style="margin-right: 10px">
                        <button class="btn btn-danger " @click="regresar_atras">
                            CANCELAR
                        </button>
                    </div>
                </div>
            </div>
        </nav>
        <div class="contenedor">
            <br>
            <strong><p class="text-center">Datos de la reserva</p></strong>
            <hr>

            <div class="container">
                <div class="row">
                    <div class="col-sm">
                        <strong><p class="text-left">Nombre completo: {{nombre}}</p></strong>
                    </div>
                    <div class="col-sm">
                        <strong><p class="text-center">Número expediente: {{nro_exp}}</p></strong>
                    </div>
                    <div class="col-sm">
                        <strong><p class="text-center">Número documento: {{nro_doc}}</p></strong>
                    </div>
                </div>
            </div>
            <hr style="margin-top: 5px">
            <div class="container">
                <div class="row">
                    <div class="d-flex col">
                        <strong><p>Profesional</p></strong>
                        <select v-model="selectProfesional" class="form-select" style="height: 33px" @change="cambiar_profesional">
                            <option 
                                v-for="item in profesionales" 
                                :key="item.id"
                                :value="item.id"
                            >
                                {{item.nombre}}
                            </option>
                        </select>
                    </div>
                    <div class="d-flex col">
                        <strong><p>Especialidad</p></strong>
                        <select v-model="selectEspecialidad" class="form-select" style="height: 33px" @change="cambiar_especialidad">
                            <option 
                                v-for="item in especialidades" 
                                :key="item.id"
                                :value="item.id"
                            >
                                {{item.nombre}}
                            </option>
                        </select>
                    </div>
                    <div class="d-flex col">
                        <strong><p>Turno</p></strong>
                        <select v-model="selectTurno" class="form-select" style="height: 33px" @change="cambiar_turno">
                            <option 
                                v-for="item in turnos" 
                                :key="item.id"
                                :value="item.id"
                            >
                                {{item.nombre}}
                            </option>
                        </select>
                    </div>
                    <div class="d-flex col">
                        <strong><p>Fecha</p></strong>
                        <select v-model="selectFecha" class="form-select" style="height: 33px" @change="cambiar_fecha">
                            <option 
                                v-for="item in fechas_reserva" 
                                :key="item.id"
                                :value="item.id"
                            >
                                {{item.nombre}}
                            </option>
                        </select>
                    </div>
                </div>
            </div>
            <hr style="margin-top: 6px">
            <TablaFechas
                :id_paciente=+nro_exp
                :id_profesional=selectProfesional
                :id_especialidad=selectEspecialidad
                :id_turno=selectTurno
                :id_fecha=selectFecha
            />
        </div>
    </div>
</template>

<script>
import {defineAsyncComponent} from 'vue'
import { mapGetters} from 'vuex'
import Swal  from 'sweetalert2'
import authApi from '@/api/authApi'

export default {
    data(){
        return{
            nombre: null,
            nro_exp: this.$route.params.id_paciente,
            nro_doc: null,
            turnos: [{id: 0, nombre: '-- TODOS --'}],
            profesionales: [{'id': 0, 'nombre': '-- TODOS --'}],
            especialidades: [{'id': 0, 'nombre': '-- TODOS --'}],
            fechas_reserva: [{'id': '0', 'nombre': '-- TODOS --'}],

            //Selecciones
            selectTurno: 0,
            selectProfesional: 0,
            selectEspecialidad: 0,
            selectFecha: 0
        }
    },

    async mounted(){
        await this.validar_role();
        this.valores_iniciales();
        this.iniciar();
        await this.obtener_datos_paciente();
        this.validar_paciente();
        await this.obtener_datos_lista_desplegable();
    },

    components: {
        TablaFechas: defineAsyncComponent(() => import ('@/modules/admin/components/TablaFechasReserva'))
    },

    computed:{
        ...mapGetters('auth', ['accessToken']),
        ...mapGetters('auth', ['role']),
        ...mapGetters('auth', ['username']),
    },

    methods: {
        regresar_atras(){
            if(this.role === 3) {
                this.$router.push({ name: 'menu-paciente' });
            } else {
                this.$router.push({ name: 'lista-pacientes-admin' });
            }
        },

        async validar_role(){
            if(this.role === 3) {
                const id = await this.obtener_id();

                if(+this.$route.params.id_paciente !== id) {
                    Swal.fire({
                    title: 'Error en los parámetros de la URL',
                    icon: 'error',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK',
                    backdrop: `rgba(128,128,128,1)`
                    }).then(() => {
                        this.$router.push({ path: '/' });
                    })
                }
            }
        },

        async obtener_id(){
            const {data} = await authApi.get('/obtener_id_paciente', {
                params: {
                    username: this.username,
                },
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })

            return +data.id_paciente
        },

        valores_iniciales(){
            this.selectProfesional = +this.$route.query.id_profesional || 0
            this.selectEspecialidad = +this.$route.query.id_especialidad || 0
            this.selectTurno = +this.$route.query.id_turno || 0
            this.selectFecha = this.$route.query.fecha || '0'
        },

        async obtener_datos_lista_desplegable(){
            //PARA PROFESIONALES
            const {data} = await authApi.get('/reservas/v2/distinct', {
                params: {
                    id: 'id_profesional',
                    propiedad: 'profesional',
                    id_profesional: this.$route.query.id_profesional || 0,
                    id_turno: this.$route.query.id_turno || 0,
                    id_especialidad: this.$route.query.id_especialidad || 0,
                    fecha: this.$route.query.fecha || '0',
                },
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })

            for (let j = 0 ; j < data.length ; j++) {
                this.profesionales.push({id: data[j].id_profesional, nombre: data[j].profesional})
            }

            await this.lista_turnos();
            await this.lista_especialidades();
            await this.lista_fechas();
        },

        async cambiar_profesional(){
            //const id_pro = this.$route.query.id_profesional
            const id_tur = this.$route.query.id_turno
            const id_esp = this.$route.query.id_especialidad
            const fecha = this.$route.query.fecha

            await this.$router.replace({query: { id_profesional: this.selectProfesional, 
                                        id_especialidad: id_esp,
                                        id_turno: id_tur,
                                        fecha: fecha}})

            this.$router.go(0);
        },

        async cambiar_fecha(){
            const id_pro = this.$route.query.id_profesional
            const id_tur = this.$route.query.id_turno
            const id_esp = this.$route.query.id_especialidad
            //const fecha = this.$route.query.fecha

            await this.$router.replace({query: { id_profesional: id_pro, 
                                        id_especialidad: id_esp,
                                        id_turno: id_tur,
                                        fecha: this.selectFecha}})

            this.$router.go(0);
        },

        async cambiar_especialidad(){
            const id_pro = this.$route.query.id_profesional
            const id_tur = this.$route.query.id_turno
            //const id_esp = this.$route.query.id_especialidad
            const fecha = this.$route.query.fecha

            await this.$router.replace({query: { id_profesional: id_pro, 
                                        id_especialidad: this.selectEspecialidad,
                                        id_turno: id_tur,
                                        fecha: fecha}})

            this.$router.go(0);
        },

        async cambiar_turno(){
            const id_pro = this.$route.query.id_profesional
            //const id_tur = this.$route.query.id_turno
            const id_esp = this.$route.query.id_especialidad
            const fecha = this.$route.query.fecha

            await this.$router.replace({query: { id_profesional: id_pro, 
                                        id_especialidad: id_esp,
                                        id_turno: this.selectTurno,
                                        fecha: fecha}})

            this.$router.go(0);
        },

        async lista_turnos(){
            //TURNOS
            let {data} = await authApi.get('/reservas/v2/distinct', {
                params: {
                    id: 'id_turno',
                    propiedad: 'turno',
                    id_profesional: this.$route.query.id_profesional || 0,
                    id_turno: this.$route.query.id_turno || 0,
                    id_especialidad: this.$route.query.id_especialidad || 0,
                    fecha: this.$route.query.fecha || '0',
                },
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })

            for (let j = 0 ; j < data.length ; j++) {
                this.turnos.push({id: data[j].id_turno, nombre: data[j].turno})
            }
        },

        async lista_fechas(){
            //FECHAS
            let {data} = await authApi.get('/reservas/v2/distinct/fecha', {
                params: {
                    id: 'fecha',
                    propiedad: 'fecha',
                    id_profesional: this.$route.query.id_profesional || 0,
                    id_turno: this.$route.query.id_turno || 0,
                    id_especialidad: this.$route.query.id_especialidad || 0,
                    fecha: this.$route.query.fecha || '0',
                },
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })

            for (let j = 0 ; j < data.length ; j++) {
                this.fechas_reserva.push({id: data[j].fecha, nombre: data[j].desc})
            }
        },

        async lista_especialidades(){
            //TURNOS
            let {data} = await authApi.get('/reservas/v2/distinct', {
                params: {
                    id: 'id_especialidad',
                    propiedad: 'especialidad',
                    id_profesional: this.$route.query.id_profesional || 0,
                    id_turno: this.$route.query.id_turno || 0,
                    id_especialidad: this.$route.query.id_especialidad || 0,
                    fecha: this.$route.query.fecha || '0',
                },
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })

            for (let j = 0 ; j < data.length ; j++) {
                this.especialidades.push({id: data[j].id_especialidad, nombre: data[j].especialidad})
            }
        },

        validar_paciente(){
            if(!this.nombre) {
                Swal.fire({
                title: 'No existe el paciente solicitado',
                icon: 'error',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK',
                backdrop: `rgba(128,128,128,0.9)`
                }).then(() => {
                    this.$router.push({ name: 'menu-admin' });
                })
            }
        },

        async obtener_datos_paciente(){
            const {data} = await authApi.get('/pacientes/consulta_datos_paciente', {
                params: {
                    id_paciente: this.$route.params.id_paciente
                },
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })

            this.nombre = data.nombre_completo
            this.nro_doc = data.nro_doc
        },

        iniciar(){
            if(isNaN(this.$route.params.id_paciente)) {
                Swal.fire({
                title: 'El ID es inválido',
                icon: 'error',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK',
                backdrop: `rgba(128,128,128,0.9)`
                }).then(() => {
                    this.$router.push({ name: 'menu-admin' });
                })
            }
        }
    }
}
</script>

<style scoped>
    .contenedor{
        background-color: #ededed;
    }
    
    strong{
        margin-top: 5px;
    }

    hr {
        margin-left: 3rem;
        margin-right: 3rem;
        border: 0;
        border-top: 1px solid black; 
    }

    select{
        border:1px solid black;
        margin-left: 10px;
    }

    select:focus {
        box-shadow: none;
        border:1px solid black;
    }
</style>