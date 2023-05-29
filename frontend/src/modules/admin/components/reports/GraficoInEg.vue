<template>
    <div>
        <nav class="navbar" style="background: transparent">
            <div style="margin-left: 15px; margin-top: 7px; height: 30px; width: 600px;">
                <label style="font-size: 25px;">
                    <i class="fas fa-coins"></i><strong>&nbsp;&nbsp; Evolutivo Ingreso y Egresos</strong>
                </label>
            </div>
        </nav>

        <div style="border: 1px solid; border-radius: 10px; background-color: #e1dede; margin-top: 10px; margin-right: 20px;">
            <v-chart class="chart_ing_egr" :option="option" autoresize style="margin-top: 15px;"/>
        </div>
    </div>
</template>
  
<script>
    import { use } from 'echarts/core';
    import { CanvasRenderer } from 'echarts/renderers';
    import { LineChart } from 'echarts/charts';
    import {
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent 
    } from 'echarts/components';
    import VChart from 'vue-echarts';

    export default {
        data(){
            return {
                option: null,
                ingresos: [],
                egresos: []
            }
        },

        props: {
            titulo: {
                type: String,
                required: false
            },
        },

        components: {
            VChart
        },

        methods: {
            get_saldos(){
                for (var i = 0; i < 12; i++) {
                    this.ingresos.push(Math.floor(Math.random() * 100) + 1)
                    this.egresos.push(Math.floor(Math.random() * 100) + 1)
                }
            }
        },

        created(){
            this.get_saldos()
            use([
                CanvasRenderer,
                //PieChart,
                LineChart,
                TitleComponent,
                TooltipComponent,
                LegendComponent,
                GridComponent 
            ]);


            this.option = {
                legend: {},

                tooltip: {
                    trigger: 'axis',
                    //axisPointer: { type: 'cross' }
                },

                xAxis: {
                    data: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
                },

                yAxis: {},

                series: [
                    {
                        name: "Ingresos",
                        data: this.ingresos,
                        //smooth: true,
                        type: 'line',
                        color: 'green',
                        lineStyle: {
                            width: 3,
                        },
                        /*label: {
                            show: true,
                            position: 'top',
                            textStyle: {
                                fontSize: 10
                            }
                        },*/
                        /*areaStyle: {
                            opacity: 0.5
                        }*/
                    },
                    {
                        name: 'Egresos',
                        data: this.egresos,
                        type: 'line',
                        //smooth: true,
                        color: 'red',
                        lineStyle: {
                            width: 3,
                        },
                        /*label: {
                            show: true,
                            position: 'bottom',
                            textStyle: {
                                fontSize: 10
                            }
                        },*/
                        /*areaStyle: {
                            opacity: 0.5
                        }*/
                    }
                ]
            };
        }
    }
    </script>
  
  <style scoped>
  .chart_ing_egr {
    height: 44vh; /*59 */
    width: 95vh;
  }
  </style>
  