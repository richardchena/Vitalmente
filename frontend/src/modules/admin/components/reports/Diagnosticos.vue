<template>
    <div>
        <nav class="navbar" style="background: transparent">
            <div style="margin-left: 15px; margin-top: 7px; height: 30px;">
                <label style="font-size: 25px;">
                    <i class="fas fa-stethoscope"></i><strong>&nbsp;&nbsp;Diagnósticos</strong>
                </label>
            </div>
        </nav>

        <div style="height: 250px; border: 1px solid; border-radius: 10px; background-color: #e1dede; margin-top: 10px;" v-if="encabezado && valores">
            <v-chart class="chart_diagnostivos" :option="option"/>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import authApi from '@/api/authApi'
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

    computed:{
        ...mapGetters('auth', ['accessToken']),
    },

    data(){
        return {
            option: null,
            encabezado: [],
            valores: []
        }
    },

    methods: {
        async get_diagnosticos(){
            const {data} = await authApi.get('/reports/diagnosticos', {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })
            
            let valor = Array.from(data)
            let a = [], b = [];

            for (let i = 0; i < valor.length; i++) {
                a.push(valor[i].name)
                b.push(+valor[i].value)
            }

            this.encabezado = a;
            this.valores = b;
        }
    },

    async created() {
        await this.get_diagnosticos()
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

            xAxis: {
                type: 'category',
                data: this.encabezado,
                axisLabel: { interval: 0, rotate: 30 }
            },

            yAxis: {
                type: 'value'
            },

            series: [
                {
                    data: this.valores,
                    type: 'bar'
                }
            ],

            label: {
                show: true,
                position: 'top',
                color: 'black'
            },

            color: 'green'
            
        };
    }    
}
</script>

<style scoped>
  .chart_diagnostivos {
    height: 100%; /*59*/
    width: 100%;
  }
</style>