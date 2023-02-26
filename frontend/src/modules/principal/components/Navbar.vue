<template>
    <nav class="navbar bg-primary">
        <a class="navbar-brand text-black" @click="menu_principal">
            <img
                src="@/assets/logos/logo1.png"
                alt="Logo"
                height="30"
                class="d-inline-block align-text-top mx-2"
            >
            <strong>Vitalmente&nbsp;&nbsp;</strong>
        </a>

        <div class="d-flex justify-content-center border border-dark rounded w-25 h-50">
            <strong>PORTAL {{rol}}</strong>
        </div>

        <div class="d-flex flex-row align-items-center justify-content-center">
            <div class="p-2">
                <img src="@/assets/icon.png" 
                alt="persona" 
                class="rounded-circle"
                height="30">
            </div>

            <div class="p-2">
                <strong>USUARIO: {{nombre}}</strong>
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
    import authApi from '@/api/authApi'
    import { mapGetters /*, mapActions*/} from 'vuex'
    

    export default {
        data() {
            return {
                rol: 'Cargando...',
                nombre: 'Cargando...',
            }
        },

        async created() {
            await this.get_data_current_user()
        },

        computed:{
            ...mapGetters('auth', ['username']),
            ...mapGetters('auth', ['accessToken']),
            ...mapGetters('auth', ['role'])
        },

        methods:{
            menu_principal(){
                if(this.role === 1){
                    this.$router.push({name: 'menu-admin'})
                } else {
                    this.$router.push({name: 'paciente-home'})
                }
            },

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
                        store.dispatch('auth/cerrar_sesion')
                        this.$router.push({name: 'login'})
                    }
                })
            },

            async get_data_current_user(){
                const {data} = await authApi.get('/obtener_datos_usuario', {
                    params: {'username': this.username},
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`
                    }
                })
                this.rol = data.rol
                this.nombre = data.nombre
            }
        }
    }  
</script>

<style scoped>
    a {
        margin-left: 15px;
    }

    a:hover {
        cursor:pointer;
        background-color: rgba(0, 255, 38, 0.218);
        border-radius: 10px;
        border: 0.001em solid gray;
    }

    a:hover strong {
        color: rgba(0, 0, 0, 0.67);
    }
</style>