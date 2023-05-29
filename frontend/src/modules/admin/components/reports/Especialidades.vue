<template>
    <div>
        <nav class="navbar" style="background: transparent">
            <div style="margin-left: 15px; margin-top: 7px; height: 30px;">
                <label style="font-size: 25px;">
                    <i class="fas fa-notes-medical"></i><strong>&nbsp;&nbsp;Especialidades</strong>
                </label>
            </div>
        </nav>

        <div style="height: 250px; border: 1px solid; border-radius: 10px; background-color: #e1dede; margin-top: 10px;">
            <v-chart class="chart_especialidades" :option="option"/>
        </div>
    </div>
</template>

<script>
    import { use } from 'echarts/core';
    import { CanvasRenderer } from 'echarts/renderers';
    import { PieChart } from 'echarts/charts';
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
            PieChart,
            TitleComponent,
            TooltipComponent,
            LegendComponent,
            GridComponent 
        ]);

        this.option = {
            tooltip: {
                trigger: 'item'
            },

            //legend: {
                /*left: 'left',
                orient: 'vertical',*/
                //top: 'bottom'
            //},

            label: {
                show: true,
                color: 'black',
                formatter(param) {
                    return '(' + Math.round(param.percent) + '%) ' + param.name ;
                }
            },

            series: [
            {
                type: 'pie',

                radius: ['40%', '70%'],

                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                
                data: [
                    { value: 456, name: 'Especialidad 1' },
                    { value: 864, name: 'Especialidad 2' },
                    { value: 145, name: 'Especialidad 3' },
                    { value: 125, name: 'Especialidad 4' },
                    { value: 698, name: 'Especialidad 5' }
                ]
            }
            ]
};
    }    
}
</script>

<style scoped>
  .chart_especialidades {
    height: 100%; /*59*/
    width: 100%;
  }
</style>