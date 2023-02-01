<template>
    <!--<h1>{{prueba}}</h1>-->
    <div class="container h-100">
        <div class="row d-flex justify-content-center align-items-center h-100">
            <div class="col-12 col-md-8 col-lg-6 col-xl-5">
                <div class="card shadow-2-strong" style="border-radius: 15px;">
                    <div class="card-body p-5 text-center">

                        <img src="@/assets/logos/logo1.png" class="rounded mx-auto d-block" alt="logo" height="180" width="180">

                        <h2 class="mb-5" style="margin-top: 20px">Clínica VitalMente</h2>

                        <div class="form-outline mb-4">
                            <input v-model="user" placeholder="Usuario" type="text" :class="input_user" required>
                            <div id="validationServerUsernameFeedback" class="invalid-feedback">
                                Por favor ingrese el username
                            </div>
                        </div>

                        <div class="form-outline mb-4">
                            <input v-model="pass" placeholder="Contraseña" type="password" :class="input_pass" required>
                            <div id="validationServerPassFeedback" class="invalid-feedback">
                                {{msg}}
                            </div>
                        </div>

                        <div >
                            <button class="btn btn-primary btn-lg btn-block" @click="validar">Iniciar sesión</button>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions} from 'vuex'

export default {
    data() {
        return {
            user: null,
            pass: null,
            input_user: 'form-control form-control-lg',
            input_pass: 'form-control form-control-lg',
            msg: 'Por favor ingrese la contraseña'
            //prueba: null
        }
    },

    /*
    created() {
        this.prueba = this.currentStatus
    },

    watch: {
        currentStatus: function(value) {
            this.prueba = value;
        }
    },*/

    computed:{
        ...mapGetters('auth', ['currentStatus'])
    },

    methods:{
        ...mapActions('auth', ['signInUser']),

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
        }
    }
}
</script>