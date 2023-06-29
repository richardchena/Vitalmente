<template>
    <div>
        <nav class="navbar" style="background: transparent">
            <div style="margin-left: 15px; margin-top: 7px; height: 30px; width: 600px;">
                <div class="row" style="margin-right: auto;">
                    <div class="col-6" style="margin-left: 10px;">
                        <label style="font-size: 25px;">
                            <i class="fas fa-coins"></i><strong>&nbsp;&nbsp;Ingreso y Egresos</strong>
                        </label>
                    </div>
                    
                    <div class="col" >
                        <select v-model="select_type" class="form-select" style="margin-left: -50px;">
                            <option value=1>MENSUAL</option>
                            <option value=2>DIARIA</option>
                        </select>
                    </div>

                    <div class="col" v-if="+select_type === 1">
                        <select v-model="select_type_anho" class="form-select" style="margin-left: -50px;">
                            <option value=1>2023</option>
                        </select>
                    </div>

                    <div class="col" v-if="+select_type === 2">
                        <select v-model="select_type_mes" class="form-select" style="margin-left: -50px; width: 110%;">
                            <option value=1>MAYO/2023</option>
                            <option value=2>JUNIO/2023</option>
                            <option value=3>JULIO/2023</option>
                        </select>
                    </div>
                </div> 
            </div>
        </nav>

        <div style="border: 1px solid; border-radius: 10px; background-color: #e1dede; margin-top: 10px; margin-right: 20px;">
            <v-chart class="chart_ing_egr" :option="option" style="margin-top: 15px;" />
        </div>
    </div>
</template>
  
<script>
    import {mapGetters} from 'vuex'
    import authApi from '@/api/authApi'
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

    import endOfMonth from 'date-fns/endOfMonth';
    import startOfMonth from 'date-fns/startOfMonth';
    import intervalToDuration from 'date-fns/intervalToDuration';

    export default {
        data(){
            return {
                option: null,
                ingresos: [0],
                egresos: [0],
                encabezado: ['prueba'],

                select_type: 1,
                select_type_anho: 1,
                select_type_mes: 3
            }
        },

        computed:{
            ...mapGetters('auth', ['accessToken']),
        },

        components: {
            VChart
        },

        methods: {
            async get_datos_mensual (){
                const {data} = await authApi.get('/reports/ingreso_egreso_mensual', {
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`
                    }
                })

                let a = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul']
                let ing = Array.apply(null, Array(6)).map(Number.prototype.valueOf,0);
                let egr = Array.apply(null, Array(6)).map(Number.prototype.valueOf,0);

                for (let i = 0; i < data.length; i++) {
                    if(data[i].tipo === 'Ingreso') {
                        ing[+data[i].mes - 1] = +data[i].monto
                    } else {
                        egr[+data[i].mes - 1] = +data[i].monto
                    }
                }

                this.option.xAxis.data = a
                this.option.series[0].data = ing
                this.option.series[1].data = egr
            },

            async get_datos(){
                const {data} = await authApi.get('/reports/ingreso_egreso_diario', {
                    params: {
                        mes: this.select_type_mes
                    },
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`
                    }
                })
                
                this.construir_datos(data)
            },

            construir_datos(valores){
                let diff;

                if(+this.select_type_mes === 1){
                    diff = intervalToDuration({
                        start: startOfMonth(new Date(2023, 5 - 1, 1)),
                        end: endOfMonth(new Date(2023, 5 - 1, 1))
                    })
                } else if(+this.select_type_mes === 2){
                    diff = intervalToDuration({
                        start: startOfMonth(new Date(2023, 6 - 1, 1)),
                        end: endOfMonth(new Date(2023, 6 - 1, 1))
                    })
                } else {
                    diff = intervalToDuration({
                        start: startOfMonth(new Date(2023, 7 - 1, 1)),
                        end: endOfMonth(new Date(2023, 7 - 1, 1))
                    })
                }

                let dias_ingreso = Array.apply(null, Array(diff.days + 1)).map(Number.prototype.valueOf,0);
                let dias_egreso = Array.apply(null, Array(diff.days + 1)).map(Number.prototype.valueOf,0);
                let dias_encabezado = Array.from({length: diff.days + 1}, (x,i) => i+1);

                for (let i = 0; i < valores.length; i++) {
                    if (valores[i].tipo === 'Ingreso') dias_ingreso[+valores[i].dia - 1] = +valores[i].monto
                    else dias_egreso[+valores[i].dia - 1] = +valores[i].monto
                }

                this.ingresos = dias_ingreso
                this.egresos = dias_egreso

                let aux = [];

                for (let i = 0; i < dias_encabezado.length; i++) {
                    aux.push(/*'Día ' + */ dias_encabezado[i])
                    //this.encabezado = dias_encabezado
                } 

                this.encabezado = aux
            }
        },

        watch: {
            async select_type(){
                if(+this.select_type === 2) {
                    await this.get_datos()
                    this.option.xAxis.data = this.encabezado
                    this.option.series[0].data = this.ingresos
                    this.option.series[1].data = this.egresos
                } else {
                    this.get_datos_mensual()
                }
            },

            async select_type_mes(){
                await this.get_datos()
                this.option.xAxis.data = this.encabezado
                this.option.series[0].data = this.ingresos
                this.option.series[1].data = this.egresos
            }
        },

        async mounted(){
            this.option.xAxis.data = this.encabezado
            this.option.series[0].data = this.ingresos
            this.option.series[1].data = this.egresos
        },

        created(){
            if(+this.select_type === 1) 
                 this.get_datos_mensual()
            else 
                 this.get_datos()


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
                    //data: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
                    //data: this.encabezado
                    data: ['000']
                },

                yAxis: {},

                series: [
                    {
                        name: "Ingresos",
                        //data: this.ingresos,
                        data: [100],
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
                        //data: this.egresos,
                        data: [100],
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
    height: 48vh; /*59 */
    width: 95vh;
  }
  </style>
  