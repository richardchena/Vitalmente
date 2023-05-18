<template>
    <div>
        <nav class="navbar" style="background: #c6c6c6">
            <div style="margin-left: 15px; margin-top: 7px; height: 30px">
                <strong>Atención de citas</strong>
            </div>

            <div class="d-flex flex-row align-items-center justify-content-center">
                <div class="d-flex flex-row align-items-center justify-content-center">
                    <div style="margin-right: 10px">
                        <button style="margin-right: 10px" class="btn btn-info text-white " @click="ver_todos_001">
                            VER CITAS AGENDADAS
                        </button>
                        <button class="btn btn-danger" @click="regresar_atras_001">
                            IR A INICIO
                        </button>
                    </div>
                </div>
            </div>
        </nav>
        <div class="btn-group d-flex w-100" role="group">
            <router-link
                :to="{ name: 'atencion-atendidos-prof' }"
                tag="button" 
                class="btn btn-b_no_act w-100">
                Atendidos
            </router-link>
            <router-link
                :to="{ name: 'atencion-espera-prof' }"
                tag="button" 
                class="btn btn-b_no_act w-100">
                En espera
            </router-link>
            <router-link
                :to="{ name: 'atencion-curso-prof' }"
                tag="button" 
                class="btn btn-b_no_act w-100">
                En curso
            </router-link>
        </div>
        <!--<router-view v-slot="{ Component }">
            <keep-alive>
                <component :is="Component" />
            </keep-alive>
        </router-view>-->
        <router-view/>
    </div>
</template>

<script>
import authApi from '@/api/authApi'
import { mapGetters} from 'vuex'

export default {
    data(){
        return {
            id_profesional: null
        }
    },

    computed:{
        ...mapGetters('auth', ['accessToken', 'username']),
    },

    async created(){
        await this.obtener_id();
    },

    methods: {
        regresar_atras_001(){
            this.$router.push('/')
        }, 

        ver_todos_001(){
            this.$router.push({ name: 'citas-agendadas-prof', params: {id_profesional: +this.id_profesional}})
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
    }
}
</script>

<style scoped>
    a.router-link-exact-active {
        background-color: #8d8d8d;
        color: white;
    }

    a.router-link-exact-active:focus {
        color: white;
    }
</style>