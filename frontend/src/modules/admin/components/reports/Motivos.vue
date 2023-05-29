<template>
    <div>
        <nav class="navbar" style="background: transparent">
            <div style="margin-left: 15px; margin-top: 7px; height: 30px;">
                <label style="font-size: 25px;">
                    <i class="fas fa-file-medical-alt"></i><strong>&nbsp;&nbsp;Motivos</strong>
                </label>
            </div>
        </nav>

        <div style="height: 250px; border: 1px solid; border-radius: 10px; background-color: #e1dede; margin-top: 10px;">
            <v-chart class="chart_motivos" :option="option"/>
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

            label: {
                show: true,
                position: 'top',
                color: 'black'
            },

            xAxis: {
                type: 'category',
                data: ['Motivo 1', 'Motivo 2', 'Motivo 3', 'Otros']
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    data: [120, 200, 150, 80],
                    type: 'bar'
                }
            ]
        };
    }    
}
</script>

<style scoped>
  .chart_motivos {
    height: 100%; /*59*/
    width: 100%;
  }
</style>