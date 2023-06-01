<template>
    <div>
        <nav class="navbar" style="background: transparent">
            <div style="margin-left: 15px; margin-top: 7px; height: 30px;">
                <label style="font-size: 25px;">
                    <i class="fas fa-file-medical-alt"></i><strong>&nbsp;&nbsp;Motivos</strong>
                </label>
            </div>
        </nav>

        <div style="height: 250px; border: 1px solid; border-radius: 10px; background-color: #e1dede; margin-top: 10px;" v-if="encabezado && valores">
            <v-chart class="chart_motivos" :option="option"/>
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

    data(){
        return {
            option: null,
            encabezado: [],
            valores: []
        }
    },

    computed:{
        ...mapGetters('auth', ['accessToken']),
    },

    methods: {
        async get_motivos(){
            const {data} = await authApi.get('/reports/motivos', {
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
            this.valores = b
        }
    },

    async created() {
        await this.get_motivos()
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
                data: this.encabezado,
                axisLabel: { interval: 0, rotate: 30 }
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    data: this.valores,
                    type: 'bar',
                    //barWidth: '20%'
                }
            ]
        };
    },   
}
</script>

<style scoped>
  .chart_motivos {
    height: 100%; /*59*/
    width: 100%;
  }
</style>