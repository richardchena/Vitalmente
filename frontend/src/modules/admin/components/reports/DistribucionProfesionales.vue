<template>
    <div>
        <nav class="navbar" style="background: transparent">
            <div style="margin-left: 15px; margin-top: 7px; height: 30px;">
                <label style="font-size: 25px;">
                    <i class="fas fa-user-md"></i><strong>&nbsp;&nbsp; Distribución de atenciones por profesionales</strong>
                </label>
            </div>
        </nav>

        <div style="height: 250px; border: 1px solid; border-radius: 10px; background-color: #e1dede;">
            <v-chart class="chart0" :option="option" style="height: 300px; width: 100%; margin-top: -40px;"/>
        </div>
    </div>
</template>

<script>
    import { use } from 'echarts/core';
    import { CanvasRenderer } from 'echarts/renderers';
    import { BarChart } from 'echarts/charts';
    import {
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent 
    } from 'echarts/components';
    import VChart from 'vue-echarts';

export default {
    components: {
        VChart
    },

    data(){
        return {
            option: null,
        }
    },

    created() {
        use([CanvasRenderer,
            BarChart,
            TitleComponent,
            TooltipComponent,
            LegendComponent,
            GridComponent 
        ]);

        this.option = {
            grid: { containLabel: true },

            yAxis: {
                type: 'category',
                data: ['Ana Lucia Palacios Palacios', 
                        'Isabella Sheila Menin',
                        'Carlos Roberto Rolon Perez', 
                        'Ana Lucia Palacios Palacios', 
                        'Ana Lucia Palacios Palacios', 
                        'Ana Lucia Palacios Palacios', 
                        'Ana Lucia Palacios Palacios'],
            },
            
            xAxis: {},

            series: [
                {
                    type: 'bar',
                    label: {
                        show: true,
                        position: 'right',
                        valueAnimation: true
                    },
                    data: [23, 24, 18, 25, 27, 28, 25],
                    symbolSize: 20
                }
            ]
        };
    }    
}
</script>

<style scoped>
  .chart0 {
    /*height: 44vh; 59
    width: 170vh;*/

    height: 1000px;
    width: 200px;
  }
</style>