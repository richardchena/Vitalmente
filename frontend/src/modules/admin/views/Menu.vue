<template>
    <div>
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
                    <button class="btn btn-lg b1" @click="pagina_profesional">
                        Profesionales&nbsp;
                        <i class="fas fa-hospital-user"></i>
                    </button>
                </div>
                <div class="col-md">
                    <div class="dropdown">
                        <a class="btn btn-lg dropdown-toggle b1" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Parámetros&nbsp;
                            <i class="fas fa-cog"></i>
                        </a>

                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" style="font-weight: normal;" @click="contribuyentes">Contribuyentes</a></li>
                            <li><a class="dropdown-item" style="font-weight: normal;" @click="timbrados">Timbrados</a></li>
                            <!--<li><hr class="dropdown-divider"></li>
                            <li><a class="dropdown-item" @click="admins">Usuarios administradores</a></li>-->
                        </ul>
                    </div>
                </div>
            </div>
            <br>
            <div class="row">
                <div class="col-md">
                    <button class="btn btn-lg b1" @click="pagina_sala">
                        Atenciones del día&nbsp;
                        <i class="fas fa-clinic-medical"></i>
                    </button>
                </div>
                <div class="col-md">
                    <button class="btn btn-lg b1" @click="pagina_pagos">
                        Facturación&nbsp;
                        <i class="fas fa-cash-register"></i>
                    </button>
                </div>
                <div class="col-md">
                    <button class="btn btn-lg b1" @click="pagina_citas_agendadas">
                        Citas Agendadas&nbsp;
                        <i class="fas fa-calendar-check"></i>
                    </button>
                </div>
            </div>
            <br>
            <div class="row">
                <div class="col-md">
                    <button class="btn btn-lg b1" @click="pagina_caja">
                        Movimientos&nbsp;
                        <i class="fas fa-wallet"></i>
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

export default {
    data(){
        return {
            id_paciente: null,
            pass_new_verif: null,
            pass_new: null,
            pass_actual: null,
            input_pass1: 'form-control form-control-lg',
            input_pass2: 'form-control form-control-lg',
            input_pass3: 'form-control form-control-lg',
        }
    },

    computed:{
        ...mapGetters('auth', ['accessToken']),
        ...mapGetters('auth', ['username']),
    },

    methods: {
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

        pagina_sala(){
            this.$router.push({ name: 'tabla-lista-pacientes-reserva-hoy' })
        },

        pagina_paciente(){
            this.$router.push({ name: 'lista-pacientes-admin' })
        },

        pagina_profesional(){
            this.$router.push({ name: 'lista-profesionales-admin' })
        },

        contribuyentes(){
            this.$router.push({ name: 'lista-contribuyentes' })
        },

        timbrados(){
            this.$router.push({ name: 'timbrados' })
        },

        pagina_caja(){
            this.$router.push({ name: 'caja' })
        },

        admins(){
            alert('EN CONTRUCCIÓN...')
        },

        pagina_pagos(){
            this.$router.push({ name: 'pagos-estados' })
        },

        pagina_citas_agendadas(){
            this.$router.push({ name: 'citas-agendadas-admin' })
        }
    }
}
</script>

<style scoped>
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