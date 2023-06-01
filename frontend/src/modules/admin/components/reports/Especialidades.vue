<template>
    <div>
        <nav class="navbar" style="background: transparent">
            <div style="margin-left: 15px; margin-top: 7px; height: 30px;">
                <label style="font-size: 25px;">
                    <i class="fas fa-notes-medical"></i><strong>&nbsp;&nbsp;Especialidades</strong>
                </label>
            </div>
        </nav>

        <div style="height: 250px; border: 1px solid; border-radius: 10px; background-color: #e1dede; margin-top: 10px;" v-if="datos_esp">
            <v-chart class="chart_especialidades" :option="option_esp"/>
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
            option_esp: {},
            datos_esp: [{value: 0, name: 'prueba'}]
        }
    },

    computed:{
        ...mapGetters('auth', ['accessToken']),
    },

    async mounted(){
        const d = await this.get_especialidades();
        this.option_esp.series[0].data = d
    },

    methods: {
        async get_especialidades(){
            const {data} = await authApi.get('/reports/especialidades', {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })

            return data
        }
    },

    async created(){
        //await this.get_especialidades()
        
        use([CanvasRenderer,
            PieChart,
            TitleComponent,
            TooltipComponent,
            LegendComponent,
            GridComponent 
        ]);

        this.option_esp = {
            tooltip: {
                trigger: 'item'
            },

            label: {
                        show: true,
                        color: 'black',
                        position: 'inner',
                        formatter(param) {
                            return '(' + Math.round(param.percent) + '%) ' + param.name ;
                        }
                        //formatter: '{c}',
            },

            /*legend: {
                left: 'left',
                orient: 'center',
                top: 'bottom'
            },*/

            /*emphasis: {
                label: {
                    show: true,
                    fontSize: 40,
                    fontWeight: 'bold'
                }
            },*/

            series: [
                {
                    type: 'pie',

                    radius: ['40%', '70%'],

                    itemStyle: {
                        borderRadius: 10,
                        borderColor: '#fff',
                        borderWidth: 2
                    },
                    
                    data: this.datos_esp
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