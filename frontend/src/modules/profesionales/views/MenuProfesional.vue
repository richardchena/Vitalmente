<template>
    <div>
        <div v-if="isLoading" class="spinner-wrapper">
            <div class="spinner-border text-otros">
                <span class="visually-hidden"></span>
            </div>
            <strong style="font-size: 25px; margin-left: 20px; margin-top:15px; color: black"><p>Actualizando contraseña... Aguarde por favor</p></strong>
        </div>

        <!--MODAL ACTUALIZAR-->
        <div class="modal fade bd-example-modal-lg" id="my_modal" ref="hola" data-bs-backdrop="static" role="dialog">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Renovar contraseña</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form>
                            <div class="form-outline mb-4">
                                <label for="exampleFormControlInput1">&nbsp;Contraseña actual</label>
                                <input v-model="pass_actual" type="password" :class="input_pass1" required>
                                <div id="validationServerPassFeedback" class="invalid-feedback">
                                    Por favor ingrese la contraseña actual
                                </div>
                            </div>
                            <div class="form-outline mb-4">
                                <label for="exampleFormControlInput1">&nbsp;Nueva contraseña</label>
                                <input v-model="pass_new" type="password" :class="input_pass2" required>
                                <div id="validationServerPassFeedback" class="invalid-feedback">
                                    Por favor ingrese la nueva contraseña
                                </div>
                            </div>
                            <div class="form-outline mb-4">
                                <label for="exampleFormControlInput1">&nbsp;Repetir la nueva contraseña</label>
                                <input v-model="pass_new_verif" type="password" :class="input_pass3" required>
                                <div id="validationServerPassFeedback" class="invalid-feedback">
                                    Por favor reingresar la nueva contraseña
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-info text-white" @click="actualizar">Actualizar</button>
                    </div>
                </div>
            </div>
        </div>
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#my_modal" ref="boton" style="display: none;">
            boton oculto
        </button>
    
        <nav class="navbar" style="background: #c6c6c6">
            <div style="margin-left: 15px; margin-top: 7px; height: 30px">
                <strong>Menú principal</strong>
            </div>
        </nav>
        <br><br>
        <div class="container text-center cuadro_menu">
            <div class="row">
                <div class="col-md">
                    <button class="btn btn-lg b1" @click="pagina_paciente">
                        Pacientes&nbsp;
                        <i class="fas fa-users"></i>
                    </button>
                </div>
                <div class="col-md">
                    <button class="btn btn-lg b1" @click="pagina_agendas">
                        Mis horarios&nbsp;
                        <i class="fas fa-calendar-alt"></i>
                    </button>
                </div>
                <div class="col-md">
                    <button class="btn btn-lg b1" @click="pagina_citas">
                        Citas Agendadas&nbsp;
                        <i class="fas fa-calendar-check"></i>
                    </button>
                </div>
            </div>
            <br>
            <div class="row">
                <div class="col-md">
                    <button class="btn btn-lg b1" @click="pagina_atencion">
                        Atenciones del día&nbsp;
                        <i class="fas fa-clinic-medical"></i>
                    </button>
                </div>
                <div class="col-md">
                    <button class="btn btn-lg b1" @click="pagina_clave">
                        Cambiar Clave&nbsp;
                        <i class="fas fa-key"></i>
                    </button>
                </div>
                <div class="col-md"></div>
            </div>
        </div>
        <div class="text-center" style="font-size: 12px; margin-top: 10px; color: gray;">
            <strong>Vitalmente Software © 2023</strong>
        </div>
    </div>
</template>

<script>
import { mapGetters} from 'vuex'
import authApi from '@/api/authApi'
import 'bootstrap';
import Swal  from 'sweetalert2'
import format from 'date-fns/format';

export default {
    data(){
        return {
            id_profesional: null,
            pass_new_verif: null,
            pass_new: null,
            pass_actual: null,
            input_pass1: 'form-control form-control-lg',
            input_pass2: 'form-control form-control-lg',
            input_pass3: 'form-control form-control-lg',
            isLoading: false
        }
    },

    async created(){
        document.title = 'Menú - Profesionales'
        await this.obtener_id();
    },

    computed:{
        ...mapGetters('auth', ['accessToken']),
        ...mapGetters('auth', ['username']),
    },

    methods: {
        pagina_paciente(){
            //this.$router.push({ name: 'lista-pacientes-prof' }).then(() => { this.$router.go() })
            this.$router.push({ path: '/profesional/lista_pacientes' })
        },

        pagina_citas(){
            this.$router.push({ name: 'citas-agendadas-prof', params: {id_profesional: +this.id_profesional}, query: {fecha: format(new Date(), 'yyyy/MM/dd')}})
        },

        pagina_atencion(){
            this.$router.push({ name: 'atencion-atendidos-prof'})
        },

        pagina_agendas(){
            this.$router.push({name: 'agenda-profesional-prof', params: {id_profesional: +this.id_profesional}})
        },

        pagina_clave(){
            this.$refs.boton.click();
        },

        actualizar(){
            if (!this.pass_actual || this.pass_actual.trim() === '') {
                this.input_pass1 = 'form-control form-control-lg is-invalid'
            }

            if (!this.pass_new || this.pass_new.trim() === '') {
                this.input_pass2 = 'form-control form-control-lg is-invalid'
            }

            if (!this.pass_new_verif || this.pass_new_verif.trim() === '') {
                this.input_pass3 = 'form-control form-control-lg is-invalid'
            }   

            if (this.pass_actual && this.pass_new && this.pass_new_verif) {
                this.cambiar_pass()
            }
        },

        async obtener_id(){
            const {data} = await authApi.get('/profesionales/obtener_id', {
                params: {
                    username: this.username,
                },
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })

            this.id_profesional = +data.id_profesional
        },

        async cambiar_pass(){
            authApi.defaults.headers.common['Authorization'] = `Bearer ${this.accessToken}`
            this.isLoading = false
            
            try {
                const {data} = await authApi.post('/change_password', {
                        pass_actual: this.pass_actual,
                        pass_new: this.pass_new,
                        pass_new_verif: this.pass_new_verif,
                        username: this.username
                });
                //await new Promise(resolve => setTimeout(resolve, 1000));
                
                this.isLoading = false
                this.mensaje(data.cod, data.msg)
            } catch (error) {
                this.isLoading = false
                this.mensaje(1, error)
            }
        },

        mensaje(cod, msg){
            let rsp;
            if(cod === 0) rsp = 'success'
            else rsp = 'error'

            Swal.fire({
            html: `<h4>${msg}</h4>`,
            icon: rsp})
            .then(() => {
                if(cod === 0 ) {
                    this.$router.go(0)
                }
            });
        },
    }
}
</script>

<style scoped>
    @import '../../../styles/menu.css';
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

    .cuadro_menu{
        margin-top: 00px;
        padding: 50px;
        border: 1px solid black;
        border-radius:  10px;
        width: 75%;
    }

    .b1{
        width: 100%;
        /*background: linear-gradient(to right, #7cd175, #74d36c, #4f9e48, #2a8222);*/
        background: linear-gradient(to top, #7cd175, #8dc26f);
        border: transparent;
        color: black;
    }

    .b1:hover{
        opacity: 0.8;
        color: white;
    }
</style>