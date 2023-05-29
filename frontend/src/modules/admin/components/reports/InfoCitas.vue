<template>
    <div>
        <nav class="navbar" style="background: transparent">
            <div style="margin-left: 40px; margin-top: 25px; height: 30px; width: 600px;">
                <div class="row" style="margin-right: auto;">
                    <div class="col" style="margin-left: 10px;">
                        <label style="font-size: 25px;">
                            <i class="far fa-calendar-alt fa-lg"></i><strong>&nbsp;&nbsp; Citas y Consultas</strong>
                        </label>
                    </div>

                    <div class="col" style="margin-right: 70px;">
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

        <div class="container columna" style="width: 95%;">
            <div class="row ">
                <div class="col-5">
                    <label style="font-weight: bold; margin-left: 15px; margin-bottom: 10px; margin-top: 10px;">
                        Citas
                    </label>

                    <br>

                    <ul style="margin-left: 25px;">
                        <li>Asistidas:<strong style="margin-left: 98px">{{ pacientes.menores }}</strong></li>
                        <li>Ausencias:<strong style="margin-left: 90px">{{ pacientes.adultos }}</strong></li>
                        <li>Canceladas:<strong style="margin-left: 80px">{{ pacientes.adultos }}</strong></li>
                    </ul>
                </div>

                <div class="col-2 text-center" style="width: 10%;">
                    <div class="vertical-line"></div>
                </div>

                <div class="col-5">
                    <label style="font-weight: bold; margin-left: -5px; margin-bottom: 10px; margin-top: 10px;">
                        Consultas
                    </label>

                    <br>

                    <ul style="margin-left: 5px;">
                        <li>En curso:<strong style="margin-left: 130px">{{ pacientes.menores }}</strong></li>
                        <li>Finalizadas sin cobrar:<strong style="margin-left: 45px">{{ pacientes.menores }}</strong></li>
                        <li>Finalizadas y cobradas:<strong style="margin-left: 37px">{{ pacientes.adultos }}</strong></li>
                    </ul>
                </div>
            </div>
            <hr style="color: black; border: 1px solid; margin-top: -1px; margin-bottom: -1px;" />
            <div class="row" style="width: 49%;">
                <div class="col-5">
                    <label style="font-weight: bold; margin-left: 15px; margin-bottom: 10px; margin-top: 10px;">
                        Ingresos
                    </label>

                    <br>

                    <ul style="margin-left: 25px;">
                        <li>Facturados:<strong style="margin-left: 85px">{{ pacientes.menores }}</strong></li>
                        <li>Pendientes:<strong style="margin-left: 85px">{{ pacientes.adultos }}</strong></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import endOfMonth from 'date-fns/endOfMonth';
import format from 'date-fns/format';

export default {
    props: ['pacientes'],

    components: {
        VueDatePicker
    },

    data(){
        return {
            fin_mes: endOfMonth(new Date()),
            fecha_seleccion: { "month": format(new Date(), 'MM') - 1, "year": +format(new Date(), 'yyyy') },
        }
    }

}
</script>

<style scoped>
    .columna{
        border: 1px solid; 
        border-radius: 10px; 
        background-color: #e1dede; 
        margin-top: 10px;

    }

    div.vertical-line{
      width: 1px; 
      background-color: black;
      height: 100%;
      display: inline-block;
    }
</style>