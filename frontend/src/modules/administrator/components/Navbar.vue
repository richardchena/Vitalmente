<template>
    <nav class="navbar bg-primary">
        <a class="navbar-brand text-black">
            <img
                src="@/assets/logos/logo1.png"
                alt="Logo"
                height="30"
                class="d-inline-block align-text-top mx-2"
            >
            <strong>Vitalmente</strong>
        </a>

        <div class="d-flex justify-content-center border border-dark rounded w-25 h-50">
            <strong>PORTAL {{user}}</strong>
        </div>

        <div class="d-flex flex-row align-items-center justify-content-center">
            <div class="p-2">
                <img src="@/assets/avatar.png" 
                alt="persona" 
                class="rounded-circle"
                height="30">
            </div>

            <div class="p-2">
                <strong>USUARIO: ANA MEDINA</strong>
            </div>

            <div class="p-2">
                <button class="btn btn-outline-dark mx-2" @click="logOut">
                    <i class="fa fa-sign-out-alt"></i>
                </button>
            </div>
        </div>

    </nav>
</template>

<script>
    import store from '@/store'
    import Swal  from 'sweetalert2'
    import { mapGetters /*, mapActions*/} from 'vuex'
    

    export default {
        data() {
            return {
                user: null
            }
        },

        created() {
            this.user = this.username
        },

        computed:{
            ...mapGetters('auth', ['username'])
        },

        /*watch: {
            username: function(value) {
                this.user = value;
            }
        },*/
        
        methods:{
            //...mapActions('auth', ['cerrar_sesion']),

            logOut(){
                Swal.fire({
                title: '¿Cerrar sesión?',
                //text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Confirmar',
                cancelButtonText: 'Cancelar'

                }).then((result) => {
                    if (result.isConfirmed) {
                        //this.cerrar_sesion
                        store.dispatch('auth/cerrar_sesion')
                        Swal.fire({
                            title: 'Sesíon cerrada',
                            text: 'Por favor ingresa nuevamente tus credenciales'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                this.$router.push({name: 'login'})
                            }
                        })
                    }
                })
            }
        }
    }  
</script>