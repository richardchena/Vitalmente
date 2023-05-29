<template>
    <div>
        <nav class="navbar" style="background: #c6c6c6">
            <div style="margin-left: 15px; margin-top: 7px; height: 30px">
                <strong>Reportes y Estadísticas</strong>
            </div>

            <div class="d-flex flex-row align-items-center justify-content-center">
                <div class="d-flex flex-row align-items-center justify-content-center">
                    <div style="margin-right: 10px">
                        <button class="btn btn-danger" @click="regresar_atras">
                            IR A INICIO
                        </button>
                    </div>
                </div>
            </div>
        </nav>

        <div class="btn-group d-flex w-100" role="group">
            <router-link
                :to="{ name: 'reportes-general' }"
                tag="button" 
                class="btn btn-b_no_act w-100">
                Generales
            </router-link>
            <router-link
                :to="{ name: 'reportes-profesionales' }"
                tag="button" 
                class="btn btn-b_no_act w-100">
                Específicos
            </router-link>
        </div>
       
        <router-view v-slot="{ Component }" style="margin-top: 10px;">
            <keep-alive>
                <component :is="Component" />
            </keep-alive>
        </router-view>
    </div>
</template>

<script>

export default {
    created(){
        document.title = 'Reportes y Estadísticas'
    },

    methods: {
        regresar_atras(){
            this.$router.push({path: '/'})
        }
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