<template>
    <div>
        <nav class="navbar" style="background: #c6c6c6">
            <div style="margin-left: 15px">
                <strong>Agregar nuevo timbrado</strong>
            </div>

            <div class="d-flex flex-row align-items-center justify-content-center">
                <div style="margin-right: 10px">
                    <button class="btn btn-success " @click="validar">
                        GUARDAR
                    </button>
                </div>
                <div style="margin-right: 10px">
                    <button class="btn btn-danger " @click="regresar_atras">
                        CANCELAR
                    </button>
                </div>
            </div>
        </nav>

        <div class="contenedor">
            <br>
            <div class="container">
                <div class="row">
                    <div class="col-sm">
                        <label>&nbsp;Número <label style="color: red">*</label></label>
                        <input v-model="nro" type="number" class="form-control" maxlength = "8">
                    </div>
                    <div class="col-sm">
                        <label>&nbsp;Código del Establecimiento <label style="color: red">*</label></label>
                        <input v-model="est" type="number" class="form-control" maxlength = "3">
                    </div>
                    <div class="col-sm">
                        <label>&nbsp;Punto de Expedición <label style="color: red">*</label></label>
                        <input v-model="exp" type="number" class="form-control" maxlength = "3">
                    </div>
                </div>

                <br>
                <div class="row">
                    <div class="col-sm">
                        <label>&nbsp;Contribuyente - RUC <label style="color: red">*</label></label>
                        <select v-model="selectedRuc" class="form-select" id="select_ruc"> 
                            <option
                                v-for="item in rucs"
                                :disabled="!item.id"
                                :key="item.id"
                                :value="item.id"
                            >
                                {{item.ruc}}
                            </option>
                        </select>
                    </div>
                    <div class="col-sm">
                        <label>&nbsp;Fecha inicio vigencia <label style="color: red">*</label></label>
                        <input v-model="inicio" type="date" class="form-control" :max="hoy" :min="otro">
                    </div>
                    <div class="col-sm">
                        <label>&nbsp;Fecha fin vigencia <label style="color: red">*</label></label>
                        <input v-model="fin" type="date" class="form-control" :min="hoy" :max="max">
                    </div>
                </div>

                <br>
                <div class="row">
                    <div class="col-sm">
                        <label>&nbsp;Número inicial <label style="color: red">*</label></label>
                        <input v-model="rango_inicio" type="number" class="form-control" maxlength = "7">
                    </div>
                    <div class="col-sm">
                        <label>&nbsp;Número final <label style="color: red">*</label></label>
                        <input v-model="rango_final" type="number" class="form-control" maxlength = "7">
                    </div>
                    <div class="col-sm">
                        <label>&nbsp;Tipo de Comprobante <label style="color: red">*</label></label>
                        <select v-model="tipo_doc" class="form-select"> 
                            <option value="F" selected>FACTURA</option>
                        </select>
                    </div>
                </div>

                <br>
            </div>
            <hr>
        </div>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
import authApi from '@/api/authApi'
import Swal  from 'sweetalert2'

import format from 'date-fns/format';
import addYears from 'date-fns/addYears';

export default {
    computed:{
        ...mapGetters('auth', ['accessToken'])
    },

    created() {
        document.title = 'Nuevo Timbrado'
        this.distinct_ruc()
    },

    data(){
        return {
            rucs: [{id: null, ruc: '--Selecciona un contribuyente--'}],
            selectedRuc: null,
            fecha_inicio: null,
            hoy: format(new Date(), 'yyyy-MM-dd'),
            max: format(addYears(new Date(), 1),'yyyy-MM-dd'),
            otro: format(addYears(new Date(), -1),'yyyy-MM-dd'),

            nro: null,
            est: null,
            exp: null,
            inicio: null,
            fin: null,
            rango_inicio: null,
            rango_final: null,
            tipo_doc: 'F'
        }
    },

    methods: {
        regresar_atras(){
            this.$router.push({name: 'timbrados'})
        },

        async registrar(obj){
            authApi.defaults.headers.common['Authorization'] = `Bearer ${this.accessToken}`

            try {
                const {data} = await authApi.post(`/pagos/timbrado`, obj)

                if(data.id === 0) {
                    Swal.fire({
                    html: `<h4>Se ha registrado correctamente el timbrado #${obj.nro}</h4>`,
                    icon: 'success'})
                    .then(() => {
                        this.$router.push({ name: 'timbrados' })
                    })
                } else {
                    Swal.fire({
                    html: "<h4>Hubo un error inesperado</h4>",
                    icon: 'error'})
                }

            } catch (error) {
                console.log(error)

                Swal.fire({
                html: "<h4>Hubo un error inesperado</h4>",
                icon: 'error'})
            }
        },

        async distinct_ruc(){
            const {data} = await authApi.get('/pagos/timbrado/distinct', {
                params: {
                    cod: this.selectedDep || 0
                },
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })

            for (var i = 0; i < data.length; i++) {
                this.rucs.push(data[i])
            }
        },

        validar(){
            let obj = {
                contribuyente: this.selectedRuc,
                nro: this.nro,
                est: this.est,
                exp: this.exp,
                inicio: this.inicio,
                fin: this.fin,
                rango_inicio: this.rango_inicio,
                rango_final: this.rango_final,
                tipo_doc: 'F'
            }  

            if(!this.nro || !this.est || !this.exp || !this.inicio || !this.fin || !this.rango_inicio || !this.rango_final || !this.selectedRuc){
                Swal.fire({
                    html: "<h4>Debe completar todos los campos</h4>",
                    icon: 'error'
                })
            } else {
                if((this.rango_inicio >= this.rango_final) || (this.inicio >= this.fin)){
                    Swal.fire({
                        html: "<h4>Error de rango en los datos</h4>",
                        icon: 'error'
                    })
                } else {
                    if(this.nro.toString().length > 8 || this.est.toString().length > 3 || this.exp.toString().length > 3 || this.rango_inicio.toString().length > 7 || this.rango_final.toString().length > 7){
                        Swal.fire({
                        html: `<h4>Parámetros inválidos</h4><br>
                               <p>Nro. timbrado: 8 dígitos<br>
                               Código de establecimiento: 3 dígitos<br>
                               Punto de expedición: 3 dígitos<br>
                               Rango: 7 dígitos</p>`,
                        icon: 'error'
                    })
                    } else {
                        this.registrar(obj)
                    }
                }
            }
        }
    }
}
</script>

<style scoped>
    .contenedor{
        /*height: 80vh;*/
        background-color: #ededed;
    }

    hr {
        margin-left: 3rem;
        margin-right: 3rem;
        border: 0;
        border-top: 1px solid black;
        padding: 10px;
    }
</style>