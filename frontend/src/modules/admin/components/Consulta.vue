<template>
    <div>
        <div v-if="isLoading" class="spinner-wrapper">
            <div class="spinner-border text-otros">
                <span class="visually-hidden"></span>
            </div>
            <strong style="font-size: 25px; margin-left: 20px; margin-top:15px; color: black"><p>Modificando consulta... Aguarde por favor</p></strong>
        </div>

        <div class="container">
            <div style="margin-top: 15px; margin-bottom: 15px; display: flex">
                <strong><label style="margin-top: 1px; margin-right: 10px">Especialidad: </label></strong>
                <select v-model="select_especialidad" :disabled="this.role === 1">
                    <option 
                        v-for="item in especialidades" 
                        :key="item.id_especialidad"
                        :value="item.id_especialidad"
                    >
                        {{item.descripcion}}
                    </option>
                </select>
            </div>
            <hr>
            <div class="row">
                <div class="col-sm">
                    <div class="mb-3">
                        <label style="font-weight: bold;">Motivo de consulta</label>
                        <textarea v-model="motivo" class="form-control" rows="5" placeholder="" :disabled="this.role === 1"></textarea>
                    </div>
                </div>
                <div class="col-sm">
                    <div class="mb-3">
                        <label style="font-weight: bold;">Técnica utilizada/Sintomas actuales</label>
                        <textarea v-model="tecnica" class="form-control" rows="5" placeholder="" :disabled="this.role === 1"></textarea>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-sm">
                    <div class="mb-3">
                        <label style="font-weight: bold;">Diagnóstico actual</label>
                        <textarea v-model="diagnostico" class="form-control" rows="5" placeholder="" :disabled="this.role === 1"></textarea>
                    </div>
                </div>
                <div class="col-sm">
                    <div class="mb-3">
                        <label style="font-weight: bold;">Antecedentes</label>
                        <textarea v-model="antecedente" class="form-control" rows="5" placeholder="" :disabled="this.role === 1"></textarea>
                    </div>
                </div>
            </div>
        </div>
        <br>
        <div class="modal-footer">
            <button class="btn" data-bs-dismiss="modal" style="background-color: #dc3545; color: white">Cancelar</button>
            <button class="btn" style="background-color: #f0820d; color: white" @click="validar" :disabled="this.role === 1">Modificar</button>
        </div>
    </div>
</template>

<script>
import authApi from '@/api/authApi'
import { mapGetters} from 'vuex'
import Swal  from 'sweetalert2'

export default {
    props: {
        id_consulta: {
            type: Number,
            required: true
        },
    },

    created(){
        this.obtener_especialidades()
    },

    computed:{
        ...mapGetters('auth', ['accessToken', 'role']),
    },

    data() {
        return {
            motivo: null,
            diagnostico: null,
            tecnica: null,
            antecedente: null,

            //
            select_especialidad: 1,

            //LISTA
            especialidades: null,

            //
            isLoading: false,
        }
    },

    watch: {
        async id_consulta() {
            await this.obtener_datos_iniciales();
        },
    },

    methods: {
        validar(){
            if(!this.diagnostico || !this.motivo){
                Swal.fire({
                text: "Debe completar el motivo de consulta y diagnóstico actual",
                icon: 'warning'})
            } else {
                this.modificar()   
            }
        },

        objeto(){
            let obj = {}

            obj.id_consulta = this.id_consulta
            obj.id_especialidad = this.select_especialidad
            obj.motivo = this.motivo
            obj.diagnostico = this.diagnostico
            
            if(this.antecedente) {
                obj.antecedente = this.antecedente
            } else {
                delete obj.antecedente
            }

            if(this.tecnica) {
                obj.tecnica = this.tecnica
            } else {
                delete obj.tecnica
            }

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
                    //this.$router.push({name: 'lista-pacientes-admin'})
                    this.$router.go();
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

        async modificar(){
            this.isLoading = true
            authApi.defaults.headers.common['Authorization'] = `Bearer ${this.accessToken}`

            const objeto = this.objeto()

            try {
                const {data} = await authApi.put('/consultas', objeto)
                await new Promise(resolve => setTimeout(resolve, 1500));
                this.respuesta(data, '0')
            } catch (error) {
                this.isLoading = false
                this.respuesta(error, '999')
            }

            this.isLoading = false
        },

        async obtener_datos_iniciales(){
            const {data} = await authApi.get('/consultas/detalles', {
                params: {
                    id_consulta: this.id_consulta
                },
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })

            this.motivo = data.motivo
            this.diagnostico = data.diagnostico_actual
            this.tecnica = data.tecnica_aplicada
            this.antecedente = data.antecedente

            this.select_especialidad = data.id_especialidad
        },

        async obtener_especialidades(){
            const {data} = await authApi.get('/obtener_especialidades', {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })

            this.especialidades = data
        },
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