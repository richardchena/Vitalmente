<template>
    <div>
        <nav class="navbar" style="background: #c6c6c6">
            <div style="margin-left: 15px; margin-top: 7px; height: 30px">
                <strong>Reportes y Estadísticas</strong>
            </div>

            <div class="d-flex flex-row align-items-center justify-content-center">
                <div class="d-flex flex-row align-items-center justify-content-center">
                    <div style="margin-right: 10px">
                        <button class="btn btn-danger" @click="regresar_atras">
                            IR A INICIO
                        </button>
                    </div>
                </div>
            </div>
        </nav>


        <div class="row">
            <div class="col">
                <nav class="navbar" style="background: transparent">
                    <div style="margin-left: 40px; margin-top: 7px; height: 30px; width: 600px;">
                        <label style="font-size: 25px;">
                            <i class="fa fa-user-alt fa-lg"></i><strong>&nbsp;&nbsp; Total Pacientes: </strong>{{ pacientes.total }}
                        </label>
                    </div>
                </nav>
                <div class="container" style="width: 95%;">
                    <div class="row columna">
                        <div class="col-5">
                            <label style="font-weight: bold; margin-left: 15px; margin-bottom: 10px; margin-top: 10px;">
                                Pacientes por Sexo:
                            </label>

                            <br>

                            <label style="margin-left: 40px;">
                                <i class="fas fa-male"></i>&nbsp;&nbsp;Masculinos:<strong style="margin-left: 88px">{{ pacientes.total_masculino }}</strong>
                            </label>

                            <br>

                            <label style="margin-left: 40px;">
                                <i class="fas fa-female"></i>&nbsp;&nbsp;Femeninos:<strong style="margin-left: 90px">{{ pacientes.total_femenino }}</strong>
                            </label>

                            <br>

                            <label style="margin-left: 40px;">
                                <i class="fas fa-user fa-xs"></i>&nbsp;&nbsp;No menciona:<strong style="margin-left: 72px">{{ pacientes.total_sin_definir }}</strong>
                            </label>
                        </div>

                        <div class="col-2 text-center" style="width: 10%;">
                            <div class="vertical-line"></div>
                        </div>

                        <div class="col-5">
                            <label style="font-weight: bold; margin-left: -5px; margin-bottom: 10px; margin-top: 10px;">
                                Pacientes por Edad:
                            </label>

                            <br>

                            <ul style="margin-left: 5px;">
                                <li>Menores (0 - 17):<strong style="margin-left: 75px">{{ pacientes.menores }}</strong></li>
                                <li>Adultos (18 - 65):<strong style="margin-left: 73px">{{ pacientes.adultos }}</strong></li>
                                <li>Adultos Mayores (+65):<strong style="margin-left: 33px">{{ pacientes.mayores }}</strong></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col">
                <nav class="navbar" style="background: transparent">
                    <div style="margin-left: 15px; margin-top: 7px; height: 30px; width: 600px;">
                        <label style="font-size: 25px;">
                            <i class="far fa-calendar-alt fa-lg"></i><strong>&nbsp;&nbsp; Citas y Consultas</strong>
                        </label>
                    </div>
                </nav>

                <div style="border: 1px solid; border-radius: 10px; background-color: #e1dede; margin-top: 10px;">
                    <label style="font-weight: bold; margin-left: 15px; margin-bottom: 0px; margin-top: 10px;">
                        Fecha
                    </label>
                    <div class="row">
                        <div class="col text-center d-flex justify-content-center">
                            <div style="width: 90%;">
                                <select v-model="select_mes" class="form-select" style="margin-top: 8px;">
                                    <option 
                                        v-for="item in mes" 
                                        :key="item.id"
                                        :value="item.id"
                                    >
                                        {{item.mes}}
                                    </option>
                                </select>
                            </div>
                        </div>

                        <div class="col text-center d-flex justify-content-center">
                            <div style="width: 90%;">
                                <select v-model="select_anho" class="form-select" style="margin-top: 8px;">
                                    <option 
                                        v-for="item in anho" 
                                        :key="item.id"
                                        :value="item.id"
                                    >
                                        {{item.anho}}
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <hr style="width: 100%; border: 1px solid; margin-top: 27px;">

                    <label style="font-weight: bold; margin-left: 15px; margin-bottom: 10px; margin-top: 0px;">
                        Citas
                    </label>

                    <br>

                    <ul style="margin-left: 25px;">
                        <li>Asistidas:<strong style="margin-left: 137px">{{ pacientes.menores }}</strong></li>
                        <li>Sin Asistencia:<strong style="margin-left: 105px">{{ pacientes.adultos }}</strong></li>
                    </ul>

                    <hr style="width: 100%; border: 1px solid; margin-top: 0px;">

                    <label style="font-weight: bold; margin-left: 15px; margin-bottom: 10px; margin-top: 0px;">
                        Consultas
                    </label>

                    <br>

                    <ul style="margin-left: 25px;">
                        <li>En curso:<strong style="margin-left: 143px">{{ pacientes.menores }}</strong></li>
                        <li>Finalizadas sin cobrar:<strong style="margin-left: 58px">{{ pacientes.menores }}</strong></li>
                        <li>Finalizadas y cobradas:<strong style="margin-left: 50px">{{ pacientes.adultos }}</strong></li>
                    </ul>

                    <hr style="width: 100%; border: 1px solid; margin-top: 0px;">

                    <label style="font-weight: bold; margin-left: 15px; margin-bottom: 10px; margin-top: 0px;">
                        Ingresos
                    </label>

                    <br>

                    <ul style="margin-left: 25px;">
                        <li>Facturados:<strong style="margin-left: 128px">{{ pacientes.menores }}</strong></li>
                        <li>Pendientes:<strong style="margin-left: 128px">{{ pacientes.adultos }}</strong></li>
                    </ul>
                </div>
            </div>
        </div>
        <!--<Grafico></Grafico>-->
    </div>
</template>

<script>
//import {defineAsyncComponent} from 'vue'

export default {
    components: {
        //Grafico: defineAsyncComponent(() => import ('@/modules/admin/components/Grafico'))
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

    methods: {
        regresar_atras(){
            this.$router.push({path: '/'})
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
      width: 1px; /* Line width */
      background-color: black; /* Line color */
      height: 100%; /* Override in-line if you want specific height. */
      display: inline-block; /* Causes the line to float to left of content. 
        You can instead use position:absolute or display:inline-block
        if this fits better with your design */

    }


</style>