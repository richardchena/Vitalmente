<template>
    <div>
        <nav class="navbar" style="background: #c6c6c6">
            <div style="margin-left: 15px; margin-top: 7px; height: 30px">
                <strong>Factura número: {{nro_fac}}</strong>
            </div>
            <div class="d-flex flex-row align-items-center justify-content-center">
                <div style="margin-right: 10px">
                    <button style="margin-left: 10px" class="btn btn-dark" @click="verificar">
                        ANULAR FACTURA
                    </button>

                    <button style="margin-left: 10px" class="btn btn-danger" @click="regresar_atras">
                        CANCELAR
                    </button>
                </div>
            </div>
        </nav>

        <object v-if="pdf_url" :data="pdf_url" type="application/pdf" width="100%" height="594px"></object>
        <div v-else class="text-center">Cargando...</div>
    </div>
</template>

<script>
import { mapGetters} from 'vuex'
import authApi from '@/api/authApi'
import Swal  from 'sweetalert2'

export default {
    computed:{
        ...mapGetters('auth', ['accessToken']),
    },

    data(){
        return{
            mostrar: true,
            src: null,
            numPages: undefined,
            nro_fac: 'Cargando...',
            id_pdf: null,
            pdf_url: null,
            cod_f: null
        }
    },

    async created(){
        document.title = 'Factura'
        await this.obtener()
        //this.src = pdf.createLoadingTask(`http://localhost:9000/api/v1/factura?id=${this.id_pdf}`)
        //this.src = pdf.createLoadingTask(`http://localhost:9000/api/v1/factura?id=uhHgUYT7ybG9JnntJRpO`)
    },

    methods: {
        regresar_atras(){
            this.$router.push({name: 'pagos-estados'})
        },

        async obtener(){
            const {data} = await authApi.get('/facturacion/visualizar?id_cita=' + this.$route.params.id, {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })

            this.nro_fac = data.numero_factura
            this.id_pdf = data.id_factura_pdf
            this.cod_f = +data.cod_factura
            this.pdf_url = `http://localhost:9000/api/v1/factura?id=${this.id_pdf}`
        },

        verificar(){
            Swal.fire({
                html: `<h4>Favor confirmar la anulación</h4>`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Confirmar',
                cancelButtonText: 'Cancelar'
            })
            .then((result) => {
                if (result.isConfirmed) {
                    this.anular_factura()
                }
            })
        },

        async anular_factura(){
            const {data} = await authApi.delete('/facturacion?id_factura=' + this.cod_f, {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })

            if (data.id === 1) {
                this.$router.push({name: 'pagos-estados'})
            } else {
                Swal.fire({
                html: "<h4>Hubo un error al anular la factura</h4>",
                icon: 'error'})
            }
        }
    }
}
</script>