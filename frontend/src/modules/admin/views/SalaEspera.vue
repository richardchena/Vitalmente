<template>
    <div>
        <nav class="navbar" style="background: #c6c6c6">
            <div style="margin-left: 15px; margin-top: 7px; height: 30px">
                <strong>Citas del hoy - {{hoy}}</strong>
            </div>
        </nav>
        <div class="btn-group d-flex w-100" role="group">
            <router-link
                :to="{ name: 'tabla-lista-pacientes-reserva-hoy' }"
                tag="button" 
                class="btn btn-b_no_act w-100">
                Reservas del día
            </router-link>
            <router-link
                :to="{ name: 'tabla-lista-pacientes-reserva-hoy-en-espera' }"
                tag="button" 
                class="btn btn-b_no_act w-100">
                En sala de espera
            </router-link>
        </div>
        <router-view></router-view>
    </div>
</template>

<script>
import format from 'date-fns/format';

export default {
    created(){
        document.title = 'Sala de Espera'
    },

    data(){
        return{
            hoy: format(new Date(), 'dd/MM/yyyy'),
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