<template>
    <div>
        <VueGoodTable
            :columns="columns"
            :rows="rows"
            styleClass="vgt-table condensed"
            :pagination-options="{
                enabled: false,
                mode: 'pages',
                perPageDropdownEnabled: false,
                perPage: 9,
                nextLabel: 'Siguiente',
                ofLabel: 'de',
                pageLabel: 'Pagina',
                prevLabel: 'Anterior',    
            }"
        >
            <template #emptystate>
                <div class="text-center"><strong>{{text}}</strong></div>
            </template>
        </VueGoodTable>

    </div>
</template>

<script>
    import { VueGoodTable } from 'vue-good-table-next';
    import 'vue-good-table-next/dist/vue-good-table-next.css'

    import {mapGetters} from 'vuex'
    import authApi from '@/api/authApi'
export default {
    computed:{
        ...mapGetters('auth', ['accessToken']),
    },

    data() {
       return {
            agendas: null,

            columns: [
                {
                    label: 'Día',
                    field: 'dia',
                },
                {
                    label: 'Turno mañana',
                    field: 'turno_man'
                },
                {
                    label: 'Turno tarde',
                    field: 'turno_tar'
                },
                {
                    label: 'Especialidad',
                    field: 'especialidad'
                }
            ],

            rows: [],

            text: null,
       } 
    },

    props: {
        id_agenda: {
            type: Number,
            required: true
        },
    },

    watch: {
        async id_agenda() {
            await this.get_lista();
        }
    },

    async created(){
        await this.get_lista();
    },

    components: {
        VueGoodTable,
    },

    methods: {
        async get_lista(){
            this.rows = []
            this.text = 'Cargando horarios... Espere por favor'

            if(this.id_agenda){
                const {data} = await authApi.get('/profesionales/agenda/dias', {
                    params: {
                        id_agenda: this.id_agenda
                    },
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`
                    }
                })

                this.rows = data
                this.text = 'No hay datos para mostrar'
            }
        },
    }
}
</script>

<style scoped>
    .contendor_tabla{
        padding: 20px 100px 0px 100px;
    }
</style>