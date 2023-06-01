<template>
    <div>
        <div class="row">
            <div class="col">
                <div class="row">
                    <InfoPacientes :pacientes=pacientes1 />
                </div>

                <div class="row">
                    <InfoCitas />
                </div>
            </div>
 
            <div class="col">
                <Grafico />
            </div>
        </div>
    </div>
</template>

<script>
import {defineAsyncComponent} from 'vue'
import {mapGetters} from 'vuex'
import authApi from '@/api/authApi'

export default {
    created(){
        document.title = 'Reportes y Estadísticas'
        this.get_lista_pacientes()
        this.get_lista_edades()
        this.get_total_pacientes()

    },

    computed:{
            ...mapGetters('auth', ['accessToken']),
    },

    components: {
        Grafico: defineAsyncComponent(() => import ('@/modules/admin/components/reports/GraficoInEg')),
        InfoPacientes: defineAsyncComponent(() => import ('@/modules/admin/components/reports/InfoPacientes')),
        InfoCitas: defineAsyncComponent(() => import ('@/modules/admin/components/reports/InfoCitas'))
    },

    methods: {
        regresar_atras(){
            this.$router.push({path: '/'})
        },

        async get_lista_pacientes(){
            const {data} = await authApi.get('/reports/total_pacientes_genero', {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })

            for (var i = 0; i < data.length; i++) {
                if (data[i].genero === 'MASCULINO') this.pacientes1.masculino = data[i].cantidad
                else if (data[i].genero === 'FEMENINO') this.pacientes1.femenino = data[i].cantidad
                else if (data[i].genero === 'OTROS') this.pacientes1.otros = data[i].cantidad
            }
        },

        async get_lista_edades(){
            const {data} = await authApi.get('/reports/total_pacientes_edades', {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })

            for (var i = 0; i < data.length; i++) {
                if (data[i].categ_edad === 'MENORES') this.pacientes1.menores = data[i].cantidad
                else if (data[i].categ_edad === 'ADULTOS') this.pacientes1.adultos = data[i].cantidad
                else if (data[i].categ_edad === 'ADULTOS MAYORES') this.pacientes1.mayores = data[i].cantidad
            }
        },

        async get_total_pacientes(){
            const {data} = await authApi.get('/reports/total_pacientes', {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })

            if(data.total) {
                this.pacientes1.total = data.total
            }
        }
    },

    data(){
        return {
            pacientes1: {
                total: '0',
                masculino: '0',
                femenino: '0',
                otros: '0',
                menores: '0',
                adultos: '0',
                mayores: '0'
            },

            pacientes: {
                total: 150,
                total_masculino: 77,
                total_femenino: 50,
                total_sin_definir: 23,
                menores: 32,
                adultos: 42,
                mayores: 76
            },
            
            anho: [{id: 2023, anho: 2023}, {id: 2022, anho: 2022}],
            select_anho: 2023,

            mes: [{id: 1, mes: 'ENERO'}, 
                  {id: 2, mes: 'FEBRERO'}],
            select_mes: 1
        }
    },
}
</script>