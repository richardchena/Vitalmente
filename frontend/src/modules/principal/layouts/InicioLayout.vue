<template>
    <div>
        <Navbar/>
        <!--<Menu/>-->

        <div class="super">
            <div class="contenedor">
                <!--<ListarPaciente/>-->
                <Menu/>
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
        Menu: defineAsyncComponent(() => import ('@/modules/principal/views/Menu.vue')),
        //ListarPaciente: defineAsyncComponent(() => import ('@/modules/principal/views/ListarPacientes.vue')),
    }
}
</script>

<style scoped>
    .contenedor{
        height: 82vh;
        /*width: 100vw;*/
        /*background-color: gray;*/
        background-color: #ededed;
    }

    .super{
        padding: 10px 20px 10px 20px
    }
</style>