<template>
    <div>
        <!--PAGINA CARGAR-->
        <div v-if="isLoading" class="spinner-wrapper">
            <div class="spinner-border text-otros">
                <span class="visually-hidden"></span>
            </div>
            <strong style="font-size: 25px; margin-left: 20px; margin-top:15px; color: black"><p>Registrando consulta... Aguarde por favor</p></strong>
        </div>

        <div class="container">
            <div style="margin-top: 15px; margin-bottom: 15px; display: flex">
                <strong><label style="margin-top: 7px; margin-right: 10px">Especialidad: </label></strong>
                <select v-model="select_especialidad" :disabled="decision_disabled">
                    <option 
                        v-for="item in especialidades" 
                        :key="item.id_especialidad"
                        :value="item.id_especialidad"
                    >
                        {{item.descripcion}}
                    </option>
                </select>
                <button class="btn btn-outline-success" style="margin-left: 15px" @click="validar">
                    REGISTRAR CONSULTA
                </button>
            </div>
            <hr>
            <div class="row">
                <div class="col-sm">
                    <div class="mb-3">
                        <div style="display: flex; margin-bottom: 5px;">
                            <label style="font-weight: bold;">Motivo de consulta <label style="color: red">*</label></label>
                            <select v-model="select_motivo" style="margin-left: 10px; background-color: #c6c6c6; border-radius: 10px;">
                                <option 
                                    v-for="item in motivos" 
                                    :key="item.id"
                                    :value="item.id"
                                >
                                    {{item.descripcion}}
                                </option>
                            </select>
                            
                        </div>
                        <textarea v-model="motivo_consulta" class="form-control" rows="4"></textarea>
                    </div>
                </div>
                <div class="col-sm">
                    <div class="mb-3">
                        <div style="margin-bottom: 5px;">
                            <label style="font-weight: bold;">Técnica utilizada/Sintomas actuales</label>
                        </div>
                        <textarea v-model="tecnica_consulta" class="form-control" rows="4"></textarea>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-sm">
                    <div class="mb-3">
                        <div style="display: flex; margin-bottom: 5px;">
                            <label style="font-weight: bold;">Diagnóstico actual <label style="color: red">*</label></label>
                            <select v-model="select_diagnostico" style="margin-left: 10px; background-color: #c6c6c6; border-radius: 10px;">
                                <option 
                                    v-for="item in diagnosticos" 
                                    :key="item.id"
                                    :value="item.id"
                                >
                                    {{item.descripcion}}
                                </option>
                            </select>
                        </div>
                        <textarea v-model="diagnostico_consulta" class="form-control" rows="4"></textarea>
                    </div>
                </div>
                <div class="col-sm">
                    <div class="mb-3">
                        <div style="margin-bottom: 5px;">
                            <label style="font-weight: bold;">Antecedentes</label>
                        </div>
                        <textarea v-model="antecedente_consulta" class="form-control" rows="4"></textarea>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters} from 'vuex'
import Swal  from 'sweetalert2'
import authApi from '@/api/authApi'
import 'bootstrap';


export default {
    async created(){
        await this.obtener_especialidades();
        await this.obtener_id_prof();
        this.select_especialidad = +this.$route.params.id_esp || 1

        if(+this.$route.params.id_esp === 0) this.decision_disabled = false

        //
        await this.obtener_motivos()
        await this.obtener_diagnosticos()
    },

    computed:{
        ...mapGetters('auth', ['accessToken', 'role', 'username']),
    },

    methods: {
        async obtener_especialidades(){
            const {data} = await authApi.get('/obtener_especialidades', {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })

            this.especialidades = data
        },

        async obtener_motivos(){
            const {data} = await authApi.get('/obtener_motivos', {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })

            for (let i = 0; i < data.length; i++) {
                this.motivos.push({id: data[i].id, descripcion: data[i].descripcion})
            }
        },

        async obtener_diagnosticos(){
            const {data} = await authApi.get('/obtener_diagnosticos', {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })

            for (let i = 0; i < data.length; i++) {
                this.diagnosticos.push({id: data[i].id, descripcion: data[i].descripcion})
            }
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

        validar(){
            if(this.role === 1) {
                Swal.fire({
                html: "<h4>Solo un profesional logeado puede registrar consultas</h4>",
                icon: 'error'})
            } else {
                if(!this.diagnostico_consulta || !this.motivo_consulta || !this.select_diagnostico || !this.select_motivo){
                    Swal.fire({
                    html: "<h4>Debe completar el motivo de consulta y diagnóstico actual</h4>",
                    icon: 'warning'})
                } else {
                    this.registrar()   
                }
            }
        },

        obtener_object(){
            let obj = {}
            obj.id_paciente = +this.$route.params.id
            obj.id_profesional = +this.id_profesional
            obj.id_especialidad = this.select_especialidad
            obj.motivo = this.motivo_consulta
            obj.diagnostico = this.diagnostico_consulta
            obj.cod_motivo = this.select_motivo
            obj.cod_diagnostico = this.select_diagnostico

            if(this.tecnica_consulta && this.tecnica_consulta.trim().length !== 0) obj.tecnica = this.tecnica_consulta.trim(); else delete obj.tecnica;
            if(this.antecedente_consulta && this.antecedente_consulta.trim().length !== 0) obj.antecedente = this.antecedente_consulta.trim(); else delete obj.antecedente;

            return obj
        },

        respuesta(msg, cod){
            if(cod === '0') {
                Swal.fire({
                title: msg,
                icon: 'success',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK',
                }).then(() => {
                    if(this.role === 1) {
                        this.$router.push({name: 'historial-consultas-admin', params:{
                            id: this.$route.params.id
                        }}).then(() => { this.$router.go() })
                    } else {
                        this.$router.push({name: 'historial-consultas-prof', params:{
                            id: this.$route.params.id
                        }}).then(() => { this.$router.go() })
                    }
                });
            } else if(cod === '999'){
                const {response} = msg
                const {data} = response

                Swal.fire({
                title: data,
                icon: 'error',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK',
                }).then(() => {
                    //this.$router.push('/')
                });
            } else {
                Swal.fire({
                title: msg,
                icon: 'error',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK',
                }).then(() => {
                    //this.$router.push('/')
                });
            }
        },

        async registrar(){
            this.isLoading = true
            authApi.defaults.headers.common['Authorization'] = `Bearer ${this.accessToken}`

            const objeto = this.obtener_object()

            try {
                const {data} = await authApi.post('/consultas', objeto)
                await new Promise(resolve => setTimeout(resolve, 1500));
                this.respuesta(data.message, data.codigo)
            } catch (error) {
                this.isLoading = false
                this.respuesta(error, '999')
            }

            this.isLoading = false
        },
    },

    data() {
        return {
            motivos: [{id: 0, descripcion: '-- SELECCIONE UN MOTIVO --'}],
            select_motivo: 0,

            diagnosticos: [{id: 0, descripcion: '-- SELECCIONE UN DIAGNÓSTICO --'}],
            select_diagnostico: 0,

            select_especialidad: 1,
            especialidades: null,
            decision_disabled: true,

            motivo_consulta: null,
            tecnica_consulta: null,
            diagnostico_consulta: null,
            antecedente_consulta: null,

            isLoading: false,
            id_profesional: null
        }
    }
}

</script>

<style scoped>
    textarea{
        border:1px solid black;
    }

    textarea:focus {
        outline: none !important;
        border:1px solid gray;
        box-shadow: 0 0 10px #719ECE;
    }

    select{
        background-color: transparent;
        border: none;
    }

    select:focus {
        border: none;
        outline: none !important;
        box-shadow: none;
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