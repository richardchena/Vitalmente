<template>
    <div class="vh-100" style="background-color: gray">
        <Navbar/>
        <router-view/>
    </div>
</template>

<script>
import {defineAsyncComponent} from 'vue'

export default {
    name: 'Inicio',

    created(){
        document.title = 'Inicio'
    },

    components: {
        Navbar: defineAsyncComponent(() => import ('@/modules/principal/components/Navbar')),
    }
}
</script>