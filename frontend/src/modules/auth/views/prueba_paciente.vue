<template>
    <div>
        <Navbar/>
        EN CONSTRUCCION......
    </div>
</template>

<script>
import {defineAsyncComponent} from 'vue'

export default {

    components: {
        Navbar: defineAsyncComponent(() => import ('@/modules/principal/components/Navbar'))
    }
}

</script>