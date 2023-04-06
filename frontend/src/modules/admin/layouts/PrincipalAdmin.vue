<template>
    <div>
        <Navbar/>
        <div class="super">
            <div class="contenedor">
                <!--<router-view/>-->
                <router-view v-slot="{ Component }">
                    <keep-alive>
                        <component :is="Component" />
                    </keep-alive>
                </router-view>
            </div>
        </div>
    </div>
</template>

<script>
import {defineAsyncComponent} from 'vue'

export default {
    created(){
        document.title = 'Inicio'
    },

    components: {
        Navbar: defineAsyncComponent(() => import ('@/modules/principal/components/Navbar'))
    }
}
</script>

<style scoped>
    .contenedor{
        height: 87vh;
        background-color: #ededed;
    }

    .super{
        padding: 10px 20px 10px 20px
    }
</style>