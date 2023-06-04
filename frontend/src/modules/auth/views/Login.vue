<template>
    <div class="container h-100">
        <!--MODAL CONSULTA-->
        <div class="modal fade" id="my_modal_restablecer" ref="hola">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Recupera tu cuenta</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" ref="close_reset_boton"></button>
                    </div>

                    <div class="modal-body">
                        <label>Introduce el tipo y número de tu documento para enviarte tu nueva clave vía mail</label>
                        <div class="row" style="margin-top: 15px;">
                            <div class="col-3">
                                <select v-model="selectedDoc" class="form-select">
                                    <option 
                                        v-for="item in tipos_docs" 
                                        :key="item.id"
                                        :value="item.id"
                                    >
                                        {{item.descripcion}}
                                    </option>
                                </select>
                            </div>

                            <div class="col-5">
                                <input v-model="nro_doc" type="text" class="form-control" id="doc" placeholder="Nro. de identificación">
                            </div>

                            <div class="col-4">
                                <select v-model="selectRol" class="form-select">
                                    <option value=3>Paciente</option>
                                    <option value=2>Profesional</option>
                                    <option value=1>Empresa</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button class="btn btn-danger" data-bs-dismiss="modal">Atrás</button>
                        <button class="btn btn-success" @click="validar_reset">Buscar cuenta</button>
                    </div>
                </div>
            </div>
        </div>
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#my_modal_restablecer" ref="boton_reestablecer" style="display: none;">
            boton oculto
        </button>

        <div class="row d-flex justify-content-center align-items-center h-100">
            <div class="col-12 col-md-8 col-lg-6 col-xl-5">
                <div class="card shadow-2-strong" style="border-radius: 15px;">
                    <div class="card-body p-5 text-center">

                        <img src="@/assets/logos/logo1.png" class="rounded mx-auto d-block" alt="logo" height="180" width="180">

                        <h2 class="mb-5" style="margin-top: 10px">Clínica VitalMente</h2>

                        <div class="container">
                            <div class="row">
                                <div class="col">
                                    <div class="form-outline mb-4">
                                        <input v-model="user" placeholder="Usuario" type="text" :class="input_user" required>
                                        <div id="validationServerUsernameFeedback" class="invalid-feedback">
                                            Por favor ingrese el username
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="container">
                            <div class="row">
                                <div class="col-10">
                                    <div class="form-outline mb-4">
                                        <input v-model="pass" placeholder="Contraseña" :type="tipo" :class="input_pass" required>
                                        <div id="validationServerPassFeedback" class="invalid-feedback">
                                            {{msg}}
                                        </div>
                                    </div>
                                </div>
                                <div class="col-1">
                                    <button class="btn btn-outline-dark btn-lg" @click="mostrar_pass">
                                        <i :class="icono"></i>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div >
                            <button class="btn btn-primary btn-lg btn-block" @click="validar">Iniciar sesión</button>
                        </div>

                        <hr style="margin-top: 30px;">

                        <div>
                            <a class="btn reset link-success" @click="reset_pass">¿Has olvidado la contraseña?</a>
                        </div>

                        <div class="text-center" style="font-size: 12px; margin-top: 10px; color: gray;">
                            <strong>Vitalmente Software © 2023</strong>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions} from 'vuex'
import authApi from '@/api/authApi'
import Swal  from 'sweetalert2'

export default {
    data() {
        return {
            user: null,
            pass: null,
            input_user: 'form-control form-control-lg',
            input_pass: 'form-control form-control-lg',
            msg: 'Por favor ingrese la contraseña',
            tipo: 'password',
            icono: 'fa fa-lock',

            tipos_docs: null,
            selectedDoc: 1,
            nro_doc: null,
            selectRol: 3
        }
    },

    async created() {
        await this.get_tipos_documentos()
    },

    computed:{
        ...mapGetters('auth', ['currentStatus', 'accessToken'])
    },

    methods:{
        ...mapActions('auth', ['signInUser']),

        async validar_reset(){
            if(!this.nro_doc) {
                Swal.fire({
                    icon: 'warning',
                    html: '<h4>Debe completar el número de documento</h4>'
                })
            } else {
                const obj = {
                    role: +this.selectRol,
                    nro_doc: this.nro_doc,
                    tipo_doc: +this.selectedDoc
                }

                const {data} = await authApi.get('/reset', {
                    params: obj
                })

                if(data.length > 1) {
                    Swal.fire({
                        icon: 'error',
                        html: '<h4>Favor contactar con atención al cliente para reestablecer la contraseña<br>Disculpe las molestia</h4>'
                    })
                } else {
                    if(data.length === 1 && data[0].status !== 'A') {
                        Swal.fire({
                            icon: 'error',
                            html: '<h4>Favor contactar con atención al cliente para reestablecer la contraseña<br>Disculpe las molestia</h4>'
                        })   
                    } else {
                        Swal.fire({
                            icon: 'success',
                            html: '<h4>En caso de que la cuenta exista, se enviará la nueva contraseña a su correo</h4>'
                        })

                        if(data.length === 1 && data[0].status === 'A'){
                            const obj_pass_new = {
                                id_usuario: data[0].id,
                                email: data[0].email
                            }

                            authApi.defaults.headers.common['Authorization'] = `Bearer ${this.accessToken}`
                            await authApi.post(`/reset`, obj_pass_new)
                        }
                    }
                }
                
                this.$refs.close_reset_boton.click();
            }
        },

        reset_pass() {
            this.$refs.boton_reestablecer.click()
        },

        async get_tipos_documentos(){
            const {data} = await authApi.get('/obtener_tipos_documento', {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })

            this.tipos_docs = data
        },

        validar(){
            if (!this.user || this.user.trim() === '') {
                this.input_user = 'form-control form-control-lg is-invalid'
            } 

            if (!this.pass || this.pass.trim() === '') {
                this.msg = 'Por favor ingrese la contraseña'
                this.input_pass = 'form-control form-control-lg is-invalid'
            } 

            if (this.pass && this.user) {
                this.input_user = 'form-control form-control-lg';
                this.input_pass = 'form-control form-control-lg';

                this.iniciar_sesion()
            }
        },

        async iniciar_sesion(){
            const data = await this.signInUser({username: this.user, password: this.pass});
            if (data.ok === false){
                this.msg = data.message
                this.input_pass = 'form-control form-control-lg is-invalid'
            } else {
                this.$router.push({name: 'principal'})
            }
        },

        mostrar_pass(){
            if(this.tipo === 'password'){
                this.tipo = 'text'
                this.icono = 'fa fa-unlock'
            }
            else {
                this.tipo = 'password'
                this.icono = 'fa fa-lock'

            }
        }
    }
}
</script>

<style scoped>
    .reset{
        text-decoration: none;
    }

    .reset:hover {
        text-decoration: underline;
    }
</style>