<template>
    <div>
        <div class="row">
            <div class="col">
                <div class="row">
                    <InfoPacientes :pacientes=pacientes />
                </div>

                <div class="row">
                    <InfoCitas :pacientes=pacientes />
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

export default {
    created(){
        document.title = 'Reportes y Estadísticas'
    },

    components: {
        Grafico: defineAsyncComponent(() => import ('@/modules/admin/components/reports/GraficoInEg')),
        InfoPacientes: defineAsyncComponent(() => import ('@/modules/admin/components/reports/InfoPacientes')),
        InfoCitas: defineAsyncComponent(() => import ('@/modules/admin/components/reports/InfoCitas'))
    },

    methods: {
        regresar_atras(){
            this.$router.push({path: '/'})
        }
    },

    data(){
        return {
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