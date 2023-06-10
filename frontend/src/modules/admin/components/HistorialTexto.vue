<template>
    <div>
        <div class="container" v-if="bandera">
            <br>
            <textarea v-model="datos" class="form-control" rows="10" readonly></textarea>
        </div>

        <div v-else class="text-center" style="margin-top: 20px;">
            <img src="@/assets/loading.gif" 
                alt="persona" 
                class="rounded-circle"
                height="30"
                style="margin-right: 10px;"
            >
            <strong style="margin-top: 10px"><label>Cargando datos del historial... Espere por favor</label></strong>
        </div>
    </div>
</template>

<script>
    import authApi from '@/api/authApi'
    import { mapGetters} from 'vuex'

    export default {
        async created(){
            this.bandera = false;
            await this.obtener_lista()
            this.bandera = true;
            this.cargar()
        },

        computed:{
            ...mapGetters('auth', ['accessToken']),
        },

        data(){
            return{
                id: this.$route.params.id,
                datos: '',
                registros: null,
                bandera: null
            }
        },

        methods: {
            async obtener_lista(){
                const {data} = await authApi.get('/consultas', {
                    params:{
                        id_paciente: this.$route.params.id
                    },
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`
                    }
                })

                this.registros = data
            },

            cargar(){
                let orden = this.registros.length;

                if (this.registros.length === 0) {
                    this.sin_datos()
                } else {
                    this.fin_parrafo();
                    for (let obj of this.registros) {
                        this.insertar_datos(obj, orden, this.registros.length);
                        orden = orden - 1;
                        this.fin_parrafo();
                    }
                }
            },

            fin_parrafo(){
                this.datos = this.datos + '-'.repeat(170) + '\n'
            },

            sin_datos(){
                this.datos = this.datos + '-'.repeat(73) + '  No hay datos de consultas anteriores  ' + '-'.repeat(73) + '\n'
            },

            insertar_datos(reg, orden, total){
                this.datos = this.datos + `Orden: ${orden} de ${total}\nFecha y hora consulta: ${reg.fecha}\n`
                this.datos = this.datos + `Profesional: ${reg.profesional}\tEspecialidad: ${reg.especialidad}\n`
                this.datos = this.datos + `• Motivo consulta: ${reg.motivo}\n`
                this.datos = this.datos + `• Diagnóstico: ${reg.diagnostico_actual}\n`
                this.datos = this.datos + `• Antecedente: ${reg.antecedente}\n`
                 this.datos = this.datos + `• Técnica aplicada: ${reg.tecnica_aplicada}\n`
            }
        }
    }

</script>

<style scoped>
    textarea{
        border:1px solid black;
        resize: none;
    }

    textarea:focus {
        cursor: default;
        box-shadow: none;
        border:1px solid black;
    }
</style>