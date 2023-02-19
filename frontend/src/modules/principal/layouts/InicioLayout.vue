<template>
    <div>
        <Navbar/>

        <div class="super">
            <div class="contenedor">
                <Inicio/>
            </div>
        </div>


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

<style>
    .contenedor{
        /*height: 90vh;
        width: 100vw;*/
        background-color: gray;
    }

    .super{
        padding: 10px 20px 10px 20px
    }
</style>