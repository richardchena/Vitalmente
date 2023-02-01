<template>
    <section class="vh-100" style="background: linear-gradient(to right, #7cd175, #198754, #1d6042, #11653f)">
        <router-view/>
    </section>
</template>

<script>
export default {
    name: 'Auth',

    created(){
        document.title = 'Vitalmente - Inicia sesión'
    }
}
</script>