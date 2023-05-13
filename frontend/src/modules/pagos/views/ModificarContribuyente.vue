<template>
    <div>
        <nav class="navbar" style="background: #c6c6c6">
            <div style="margin-left: 15px">
                <strong>Modificar datos del contribuyente #{{this.$route.params.id}}</strong>
            </div>

            <div class="d-flex flex-row align-items-center justify-content-center">
                <div style="margin-right: 10px">
                    <button class="btn btn-info text-white" @click="registrar">
                        MODIFICAR
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
                        <label>&nbsp;Razón Social <label style="color: red">*</label></label>
                        <input v-model="razon" type="text" class="form-control">
                    </div>
                    <div class="col-sm">
                        <label>&nbsp;Alias <label style="color: red">*</label></label>
                        <input v-model="alias" type="text" class="form-control">
                    </div>
                    <div class="col-sm-2">
                        <label>&nbsp;Tipo Persona <label style="color: red">*</label></label>
                        <select v-model="tipo" class="form-select"> 
                            <option value="PF" selected>Persona Física</option>
                            <option value="PJ">Persona Jurídica </option>
                        </select>
                    </div>
                    <div class="col-sm-2">
                        <label>&nbsp;R.U.C. <label style="color: red">*</label></label>
                        <input v-model="ruc" type="text" class="form-control">
                    </div>
                </div>

                <br>
                <div class="row">
                    <div class="col-sm">
                        <label>&nbsp;Dirección <label style="color: red">*</label></label>
                        <input v-model="dir" type="text" class="form-control">
                    </div>
                    <div class="col-sm">
                        <label>&nbsp;Departamento <label style="color: red">*</label> </label>
                        <select v-model="selectedDep" class="form-select" @change="cambiar_ciudad">
                            <option 
                                v-for="item in departamentos" 
                                :key="item.id_departamento"
                                :value="item.id_departamento"
                            >
                                {{item.descripcion}}
                            </option>
                        </select>
                    </div>
                    <div class="col-sm">
                        <label>&nbsp;Ciudad <label style="color: red">*</label></label>
                        <select v-model="selectedCiu" class="form-select"> 
                            <option 
                                v-for="item in ciudades" 
                                :key="item.cod_concatenado"
                                :value="item.cod_concatenado"
                            >
                                {{item.descripcion}}
                            </option>
                        </select>
                    </div>
                </div>
                
                <br>
                <div class="row">
                    <div class="col-sm">
                        <label for="ocupacion">&nbsp;Teléfono <label style="color: red">*</label></label>
                        <input v-model="telf" type="tel" class="form-control">
                    </div>
                    <div class="col-sm">
                        <label for="email">&nbsp;Correo Electrónico <label style="color: red">*</label></label>
                        <input v-model="email" type="email" class="form-control" >
                    </div>
                    <div class="col-sm">
                        <label>&nbsp;Actividad Económica <label style="color: red">*</label></label>
                        <select class="form-select"> 
                            <option value="0" selected>86909 - OTRAS ACTIVIDADES RELACIONADAS CON LA SALUD HUMANA</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
        <br>
        <hr>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
import authApi from '@/api/authApi'
import Swal  from 'sweetalert2'

export default {
    created() {
        document.title = 'Modificar'
        this.datos_iniciales();
    },

    computed:{
        ...mapGetters('auth', ['accessToken'])
    },

    methods: {
        async datos_iniciales(){
            await this.get_departamentos();

            const {data} = await authApi.get('/pagos/contribuyente/modificar?id=' + this.$route.params.id, {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })

            this.razon = data.razon_social

            if(!this.razon){
                this.$router.push({path: '/'})
            }

            this.alias = data.alias
            this.tipo = data.tipo_persona
            this.ruc = data.ruc
            this.dir = data.direccion
            this.telf = data.telefono
            this.email = data.email
            this.selectedDep = data.id_departamento

            await this.get_ciudades();

            this.selectedCiu = data.ubicacion
        },

        regresar_atras(){
            this.$router.push({name: 'lista-contribuyentes'})
        },

        async registrar(){
            const obj = {}
            obj.id = this.$route.params.id
            obj.razon = this.razon
            obj.alias = this.alias
            obj.tipo = this.tipo
            obj.ruc = this.ruc
            obj.direccion = this.dir
            obj.ubi = this.selectedCiu
            obj.tel = this.telf
            obj.email = this.email
            obj.act = '86909 - OTRAS ACTIVIDADES RELACIONADAS CON LA SALUD HUMANA'

            if(this.validar()) {
                authApi.defaults.headers.common['Authorization'] = `Bearer ${this.accessToken}`

                try {
                    const {data} = await authApi.put(`/pagos/contribuyente`, obj)
                    if(data.id === 0) {
                        Swal.fire({
                        html: `<h4>${data.msg}</h4>`,
                        icon: 'success'})
                        .then(() => {
                            this.$router.push({ name: 'lista-contribuyentes' })
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
            } else {
                Swal.fire({
                html: "<h4>Debe completar todos los campos obligatorios</h4>",
                icon: 'warning'})
            }
        },

        validar(){
            if(!this.razon || !this.alias || !this.ruc || !this.ruc || !this.telf || !this.email){
                return false
            } else {
                return true
            }
        },

        async get_departamentos(){
            const {data} = await authApi.get('/obtener_departamentos', {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })

            this.departamentos = data
        },

        async get_ciudades(){
            const {data} = await authApi.get('/obtener_ciudades', {
                params: {
                    cod: this.selectedDep || 0
                },
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })

            this.ciudades = data
        },

        cambiar_ciudad(){
            this.get_ciudades()

            if(this.selectedDep === 0) 
                this.selectedCiu = 0
            else 
                this.selectedCiu = (this.zeroFill(this.selectedDep, 2) + '01')*1
        },

        zeroFill( number, width ) {
            width -= number.toString().length;
            if ( width > 0 ) {
                return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
            }

            return number + ""; // siempre devuelve tipo cadena
        }
    },

    data(){
        return {
            razon: null,
            alias: null,
            ruc: null,
            dir: null,
            telf: null,
            email: null,
            tipo: 'PF',

            selectedDep: 0,
            departamentos: null,

            ciudades: null,
            selectedCiu: 0
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