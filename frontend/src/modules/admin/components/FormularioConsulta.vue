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
                <select v-model="select_especialidad">
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
            
            <div class="row">
                <div class="col-sm">
                    <div class="mb-3">
                        <textarea v-model="motivo_consulta" class="form-control" rows="4" placeholder="Motivo de consulta"></textarea>
                    </div>
                </div>
                <div class="col-sm">
                    <div class="mb-3">
                        <textarea v-model="tecnica_consulta" class="form-control" rows="4" placeholder="Técnica utilizada/Sintomas actuales"></textarea>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-sm">
                    <div class="mb-3">
                        <textarea v-model="diagnostico_consulta" class="form-control" rows="4" placeholder="Diagnóstico actual"></textarea>
                    </div>
                </div>
                <div class="col-sm">
                    <div class="mb-3">
                        <textarea v-model="antecedente_consulta" class="form-control" rows="4" placeholder="Antecedentes"></textarea>
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
    created(){
        this.obtener_especialidades();
    },

    computed:{
        ...mapGetters('auth', ['accessToken']),
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

        validar(){
            if(!this.diagnostico_consulta || !this.motivo_consulta){
                Swal.fire({
                text: "Debe completar el motivo de consulta y diagnóstico actual",
                icon: 'warning'})
            } else {
                this.registrar()   
            }
        },

        obtener_object(){
            let obj = {}
            obj.id_paciente = +this.$route.params.id
            obj.id_profesional = 10 //CAMBIARRRRR
            obj.id_especialidad = this.select_especialidad
            obj.motivo = this.motivo_consulta
            obj.diagnostico = this.diagnostico_consulta

            if(this.tecnica && this.tecnica.trim().length !== 0) obj.tecnica = this.tecnica.trim(); else delete obj.tecnica;
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
                    this.$router.push({name: 'historial-consultas-admin', params:{
                        id: this.$route.params.id
                    }})
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
            select_especialidad: 1,
            especialidades: null,

            motivo_consulta: null,
            tecnica_consulta: null,
            diagnostico_consulta: null,
            antecedente_consulta: null,

            isLoading: false
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