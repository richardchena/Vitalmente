<template>
    <div class="d-flex justify-content-center">
        <div v-if="bandera" class="cuadro">
            <nav class="navbar" style="background: #7cd175">
                <div style="margin-left: 15px; margin-top: 7px; height: 30px; width: 600px;">
                    <strong>ATENCIÓN EN PROCESO</strong>
                </div>
            </nav>
            <br>
            <div class="container">
                <div class="row">
                    <div class="col-sm-3"></div>
                    <div class="col-sm-9">
                        <label><strong>ESPECIALIDAD: </strong>{{especialidad}}</label>
                        <br>
                        <label><strong>DOCUMENTO: </strong>{{doc}}</label>
                        <br>
                        <label><strong>PACIENTE: </strong>{{nombre_paciente}}</label>
                        <br>
                        <label><strong>CANT. DE SESIONES: </strong>{{cant_ses}}</label>
                        <br>
                        <label><strong>TURNO: </strong>{{turno}}</label>
                        <br>
                        <label><strong>HORA CITA: </strong>{{horario}}</label>
                        <br><br>
                        <div class="row justify-content-center">
                            <div class="col-4">
                                <!--<button class="btn btn-success"><i class="far fa-file-alt"></i>&nbsp;&nbsp;Expediente</button>-->
                                <router-link class="btn btn-success" 
                                :to="{ name: 'datos-historial-consultas-prof',
                                    params: { id: this.id_paciente, id_esp: this.id_esp_cita || 1}}"
                                    target="_blank"
                                >
                                    <i class="far fa-file-alt"></i>
                                    &nbsp;&nbsp;Expediente
                                </router-link>
                            </div>
                            <div class="col-4"></div>
                        </div>
                    </div>

                    <div style="padding: 0px 15px 0px 15px;"><hr style="border: 1px solid black;"></div>

                    <div class="d-flex justify-content-center" style="margin-left: -10px;">
                        <button class="btn btn-danger" @click="funcion_finalizar"><i class="fas fa-stopwatch"></i>&nbsp;&nbsp;FINALIZAR TURNO</button>
                    </div>
                    <div class="col-sm-3"></div>
                    <br>
                </div> 
            </div>
        </div>

        <div v-else class="cuadro2">
            <nav class="navbar" style="background: #7cd175">
                <div style="margin-left: 15px; margin-top: 7px; height: 30px; width: 600px;">
                    <strong>¡No hay consulta en curso!</strong>
                </div>
            </nav>
        </div>
    </div>
</template>

<script>
import 'bootstrap';
import authApi from '@/api/authApi'
import { mapGetters} from 'vuex'
import Swal  from 'sweetalert2'

export default {
    data(){
        return{
            id_profesional: null,
            id_paciente: 0,
            id_cita: null,
            bandera: false,
            id_esp_cita: null,

            especialidad: null,
            nombre_paciente: null,
            doc: null,
            cant_ses: null,
            turno: null,
            horario: null
        }
    },

    async created(){
        document.title = 'Atención en curso'
        await this.obtener_id_prof();
        await this.verificar_consulta_curso();

        if(this.bandera){
            await this.obtener_datos_paciente();
        }
    },

    methods: {
        async obtener_datos_paciente(){
            const {data} = await authApi.get('/sala_espera/profesional/datos_en_curso', {
                params: {
                    id_profesional: this.id_profesional
                },
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })

            this.id_esp_cita = data.id_esp_cita,
            this.id_cita = data.id_cita
            this.especialidad = data.especialidad
            this.nombre_paciente = data.nombre_paciente
            this.doc = data.doc
            this.cant_ses = data.cant_ses
            this.turno = data.turno
            this.horario = data.horario
            this.id_paciente = data.id_paciente

        },

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

            if(+data.cantidad == 1){
                this.bandera = true;
            }
        },

        funcion_finalizar(){
            Swal.fire({
                html: `<h4>¿Desea finalizar esta cita?</h4>`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancelar'

                }).then((result) => {
                    if (result.isConfirmed) {
                        this.confirmar(this.id_cita);
                    }
                })
        },

        error(er){
            console.log(er)
            Swal.fire({
                html: `<h4>Ha ocurrido un error inesperado</h4>`,
                icon: 'error'
            })
        },

        async confirmar(id){
            authApi.defaults.headers.common['Authorization'] = `Bearer ${this.accessToken}`

            try {
                const {data} = await authApi.post(`/sala_espera/profesional/finalizar_cita?id_cita=${id}`)
                if(data.id === 0) {
                    this.$router.push({name: 'atencion-espera-prof'})
                } else {
                    this.error(':(')
                }

            } catch (error) {
                this.error(error)
            }
        },
    },

    computed:{
        ...mapGetters('auth', ['accessToken', 'username']),
    },
}
</script>

<style scoped>
    .cuadro{
        margin-top: 50px;
        border: 1px solid gray;
    }

    .cuadro2{
        text-align: center;
        margin-top: 50px;
        border: 1px solid gray;
    }
</style>