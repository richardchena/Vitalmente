<template>
    <div>
        <nav class="navbar" style="background: #c6c6c6">
            <div style="margin-left: 15px; margin-top: 7px; height: 30px">
                <strong>Menú principal</strong>
            </div>
        </nav>
        <br><br>
        <div class="container text-center">
            <div class="row">
                <div class="col-md">
                    <button class="btn btn-success mx-2 btn-lg btn-block" @click="pagina_reserva">
                        Reservar Turno&nbsp;
                        <i class="far fa-calendar-plus"></i>
                    </button>
                </div>
                <div class="col-md">
                    <button class="btn btn-primary mx-2 btn-lg btn-block" @click="pagina_agendas">
                        Turnos Agendados&nbsp;
                        <i class="far fa-calendar-check"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters} from 'vuex'
import authApi from '@/api/authApi'

export default {
    data(){
        return {
            id_paciente: null
        }
    },

    async created(){
        await this.obtener_id();
    },

    computed:{
        ...mapGetters('auth', ['accessToken']),
        ...mapGetters('auth', ['username']),
    },

    methods: {
        async obtener_id(){
            const {data} = await authApi.get('/obtener_id_paciente', {
                params: {
                    username: this.username,
                },
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })

            this.id_paciente = +data.id_paciente
        },

        pagina_reserva(){
            this.$router.push({ name: 'reserva-cita-paciente', params: {id_paciente: this.id_paciente} })
        },

        pagina_agendas(){
            this.$router.push({ name: 'agenda-paciente', params: {id_paciente: this.id_paciente} })
        },

        
    }
}
</script>