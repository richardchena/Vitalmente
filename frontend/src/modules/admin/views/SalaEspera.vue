<template>
    <div>
        <nav class="navbar" style="background: #c6c6c6">
            <div style="margin-left: 15px; margin-top: 7px; height: 30px">
                <strong>Citas del hoy - {{hoy}}</strong>
            </div>

            <div class="d-flex flex-row align-items-center justify-content-center">
                <div class="d-flex flex-row align-items-center justify-content-center">
                    <div style="margin-right: 10px">
                        <button style="margin-right: 10px" class="btn btn-info text-white " @click="ver_todos_002">
                            VER CITAS AGENDADAS
                        </button>
                        <button class="btn btn-danger" @click="regresar_atras_002">
                            IR A INICIO
                        </button>
                    </div>
                </div>
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
    },
    
    methods: {
        regresar_atras_002(){
            this.$router.push('/')
        },

        ver_todos_002(){
            this.$router.push({name: 'citas-agendadas-admin'})
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