<template>
    <div>
        <nav class="navbar" style="background: #c6c6c6">
            <div style="margin-left: 15px; margin-top: 7px; height: 30px">
                <strong>Atención de citas</strong>
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

<style scoped>
    a.router-link-exact-active {
        background-color: #8d8d8d;
        color: white;
    }

    a.router-link-exact-active:focus {
        color: white;
    }
</style>