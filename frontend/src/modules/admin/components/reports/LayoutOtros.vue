<template>
    <div class="container">
        <div class="row" v-show="false">
            <div class="col">
                <Profesionales />
            </div>
        </div>

        <div class="row" >
            <div class="col">
                <nav class="navbar" style="background: transparent">
                    <div style="margin-left: 10px; margin-top: 25px; height: 30px; width: 600px;">
                        <div class="row">
                            <div class="col">
                                <label style="font-size: 25px;">
                                    <i class="far fa-calendar-alt fa-lg"></i><strong>&nbsp;&nbsp; Fecha</strong>
                                </label>
                            </div>

                            <div class="col" style="margin-left: -370px; width: 100px;">
                                <VueDatePicker 
                                    v-model="fecha_seleccion"
                                    locale="es-PY"
                                    :max-date="fin_mes"
                                    select-text="OK"
                                    cancel-text="Cancelar"
                                    :clearable="true"
                                    placeholder="Seleccione un periodo"
                                    month-picker
                                    required 
                                />
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
        </div>

        <hr>

        <div class="row" >
            <div class="col">
                <Especialidades :filtro_fecha="fecha_seleccion"/>
            </div>

            <div class="col-sm" >
                <Motivos :filtro_fecha="fecha_seleccion"/>
            </div>

            <div class="col-sm">
                <Diagnosticos :filtro_fecha="fecha_seleccion"/>
            </div>
        </div>
    </div>
</template>

<script>
import {defineAsyncComponent} from 'vue'
import endOfMonth from 'date-fns/endOfMonth';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

export default {
    components: {
        VueDatePicker,
        Profesionales: defineAsyncComponent(() => import ('@/modules/admin/components/reports/DistribucionProfesionales')),
        Especialidades: defineAsyncComponent(() => import ('@/modules/admin/components/reports/Especialidades')),
        Motivos: defineAsyncComponent(() => import ('@/modules/admin/components/reports/Motivos')),
        Diagnosticos: defineAsyncComponent(() => import ('@/modules/admin/components/reports/Diagnosticos')),
    },

    data(){
        return {
            fecha_seleccion: null,
            fin_mes: endOfMonth(new Date()),
        }
    }
}
</script>