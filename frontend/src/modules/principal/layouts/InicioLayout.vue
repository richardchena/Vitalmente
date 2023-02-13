<template>
    <div class="vh-100" style="background-color: gray">
        <Navbar/>
        <Inicio/>
    </div>
</template>

<script>
import {defineAsyncComponent} from 'vue'

export default {
    //name: 'Inicio',

    created(){
        document.title = 'Inicio'
    },

    components: {
        Navbar: defineAsyncComponent(() => import ('@/modules/principal/components/Navbar')),
        Inicio: defineAsyncComponent(() => import ('@/modules/principal/views/InicioAdministracion.vue')),
    }
}
</script>