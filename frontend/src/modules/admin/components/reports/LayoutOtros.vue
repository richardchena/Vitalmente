<template>
    <div class="container">
        <div class="row" v-show="false">
            <div class="col">
                <Profesionales />
            </div>
        </div>

        <div class="row" >
            <div class="col">
                <Especialidades />
            </div>

            <div class="col-sm" >
                <Motivos/>
            </div>

            <div class="col-sm">
                <Diagnosticos />
            </div>
        </div>
    </div>
</template>

<script>
import {defineAsyncComponent} from 'vue'

export default {
    components: {
        Profesionales: defineAsyncComponent(() => import ('@/modules/admin/components/reports/DistribucionProfesionales')),
        Especialidades: defineAsyncComponent(() => import ('@/modules/admin/components/reports/Especialidades')),
        Motivos: defineAsyncComponent(() => import ('@/modules/admin/components/reports/Motivos')),
        Diagnosticos: defineAsyncComponent(() => import ('@/modules/admin/components/reports/Diagnosticos')),
    },
}
</script>