<template>
    <div>
        <div v-if="isLoading" class="spinner-wrapper">
            <div class="spinner-border text-otros">
                <span class="visually-hidden"></span>
            </div>
            <strong style="font-size: 25px; margin-left: 20px; margin-top:15px; color: black"><p>Registrando paciente... Aguarde por favor</p></strong>
        </div>

        <nav class="navbar" style="background: #c6c6c6">
            <div style="margin-left: 15px">
                <strong>Registrar nuevo paciente</strong>
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
            <strong><p class="text-center">1- Datos Personales</p></strong>
            <hr>

            <div class="container">
                <div class="row">
                    <div class="col-sm">
                        <label for="primer_nombre">Primer nombre <label style="color: red">*</label></label>
                        <input v-model="pri_nom" type="text" class="form-control" id="primer_nombre" placeholder="Ingrese aquí su primer nombre">
                    </div>
                    <div class="col-sm">
                        <label for="segundo_nombre">Segundo nombre</label>
                        <input v-model="seg_nom" type="text" class="form-control" id="segundo_nombre" placeholder="Ingrese aquí su segundo nombre">
                    </div>
                    <div class="col-sm">
                        <label for="tercer_nombre">Tercer nombre</label>
                        <input v-model="ter_nom" type="text" class="form-control" id="tercer_nombre" placeholder="Ingrese aquí su tercer nombre">
                    </div>
                </div>
                <br>
                <div class="row">
                    <div class="col-sm">
                        <label for="primer_apellido">Primer apellido <label style="color: red">*</label></label>
                        <input v-model="pri_ape" type="text" class="form-control" id="primer_apellido" placeholder="Ingrese aquí su primer apellido">
                    </div>
                    <div class="col-sm">
                        <label for="segundo_apellido">Segundo apellido</label>
                        <input v-model="seg_ape" type="text" class="form-control" id="segundo_apellido" placeholder="Ingrese aquí su segundo apellido">
                    </div>
                    <div class="col-sm-2">
                        <label for="inputState">Tipo Doc. <label style="color: red">*</label></label>
                        <select v-model="selectedDoc" class="form-select">
                            <option 
                                v-for="item in tipos_docs" 
                                :key="item.id"
                                :value="item.id"
                            >
                                {{item.descripcion}}
                            </option>
                        </select>
                    </div>
                    <div class="col-sm-2">
                        <label for="doc">Nro. de doc. <label style="color: red">*</label></label>
                        <input v-model="nro_doc" type="text" class="form-control" id="doc" placeholder="Nro. de identificación">
                    </div>
                </div>
                <br>
                <div class="row">
                    <div class="col-sm">
                        <label for="inputState">Nacionalidad <label style="color: red">*</label></label>
                        <select v-model="selectedPais" class="form-select" @change="cambiar_pais">
                            <option 
                                v-for="item in paises" 
                                :key="item.id_pais"
                                :value="item.id_pais"
                            >
                                {{item.nombre}}
                            </option>
                        </select>
                    </div>
                    <div class="col-sm">
                        <label for="inputState">Departamento nacimiento</label>
                        <select v-model="selectedDep" class="form-select" :disabled="desactivar" @change="cambiar_ciudad">
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
                        <label for="inputState">Ciudad nacimiento</label>
                        <select v-model="selectedCiu" class="form-select" :disabled="desactivar"> 
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
                        <label for="segundo_apellido">Dirección actual <label style="color: red">*</label></label>
                        <input v-model="direccion" type="text" class="form-control" id="segundo_apellido" placeholder="Calle principal, secundaria y numeración">
                    </div>
                    <div class="col-sm">
                        <label for="inputState">Departamento residencia <label style="color: red">*</label></label>
                        <select v-model="selectedDepResi" class="form-select" @change="cambiar_ciudad_residencia">
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
                        <label for="inputState">Ciudad residencia <label style="color: red">*</label></label>
                        <select v-model="selectedCiuResi" class="form-select"> 
                            <option 
                                v-for="item in ciudades_residencia" 
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
                    <div class="row">
                        <div class="col-sm-4" style="margin-right: 10px">
                            <label for="primer_apellido">Fecha de nacimiento <label style="color: red">*</label></label>
                            <input v-model="fec_nac" type="date" class="form-control" id="primer_apellido" placeholder="Ingrese aquí su fecha de nacimiento" :max="max_fecha">
                        </div>
                        <div class="col-sm-2">
                            <label for="inputState">Estado civil <label style="color: red">*</label></label>
                            <select v-model="est_civ" id="inputState" class="form-select">
                                <option value="S">Soltero</option>
                                <option value="C">Casado</option>
                                <option value="V">Viudo</option>
                                <option value="D">Divorsiado</option>
                                <option value="M">Menor</option>
                                <option value="O">Otro</option>
                            </select>
                        </div>
                        <div class="col-sm-2">
                            <label for="inputState">Género <label style="color: red">*</label></label>
                            <select v-model="genero" id="inputState" class="form-select">
                                <option selected value="P">Prefiero no decirlo</option>
                                <option value="M">Masculino</option>
                                <option value="F">Femenino</option>
                                <option value="O">Otro</option>
                            </select>
                        </div>
                        <div class="col-sm" style="margin-left: 8px">
                            <label for="ocupacion">Ocupación <label style="color: red">*</label></label>
                            <input v-model="ocu" type="text" class="form-control" id="ocupacion" placeholder="Ingrese aquí su ocupación">
                        </div>
                    </div>
                </div>
            </div>

            <br>
            <strong><p class="text-center">2- Datos de acceso y otros</p></strong>
            <hr>

            <div class="container">
                <div class="row">
                    <div class="col-sm">
                        <label for="username">Username <label style="color: red">*</label></label>
                        <input v-model="username" type="text" class="form-control" id="username" placeholder="Ingrese un nombre de usuario">
                    </div>
                    <div class="col-sm">
                        <label for="email">Email <label style="color: red">*</label></label>
                        <input v-model="email" type="email" class="form-control" id="email" placeholder="Ingrese un correo electrónico">
                    </div>
                    <div class="col-sm">
                        <label for="ocupacion">Teléfono<label style="color: red">*</label></label>
                        <input v-model="telf" type="tel" class="form-control" id="telefono" pattern="[0-9]{4}-[0-9]{3}-[0-9]{3}" placeholder="Formato válido 09XX-XXX-XXX">
                    </div>
                </div>
            </div>
            
            <br>
            <hr>
        </div>
    </div>
</template>

<script>
import authApi from '@/api/authApi'
import Swal  from 'sweetalert2'
import { mapGetters} from 'vuex'

export default {
    data() {
        return {
            // Datos formulario - Personales
            pri_nom: null,
            seg_nom: null,
            ter_nom: null,
            pri_ape: null,
            seg_ape: null,
            nro_doc: null,
            fec_nac: null,
            est_civ: 'S',
            genero: 'P',
            direccion: null,

            // Usuario
            username: null,
            email:  null,
            telf: null,

            // Otros datos
            ocu: null,

            //
            max_fecha: null,

            // Parametros de la BD
            paises: null,
            departamentos: null,
            ciudades: null,
            ciudades_residencia: null,
            tipos_docs: null,

            //
            selectedDoc: 1,
            selectedPais: 139,
            selectedDep: 0,
            selectedCiu: 0,
            selectedDepResi: 0,
            selectedCiuResi: 0,

            // Extras
            desactivar: false,

            //
            isLoading: false,
        }
    },

    created () {
        document.title = 'Registrar Paciente'
        this.obtener_fecha_hoy()
        this.get_paises()
        this.get_departamentos()
        this.get_ciudades()
        this.get_ciudades_residencia()
        this.get_tipos_documentos()
    },

    computed:{
        ...mapGetters('auth', ['accessToken', 'role']),
    },

    methods:{
        obtener_fecha_hoy(){
            const date = new Date();

            const day = date.getDate();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();

            const currentDate = `${year}-${this.zeroFill(month,2)}-${this.zeroFill(day,2)}`;
            this.max_fecha = currentDate;
        },
        
        validar(){
            if(!this.pri_nom  || !this.pri_ape || !this.fec_nac || !this.username || !this.email || !this.ocu || !this.telf || !this.nro_doc || !this.direccion){
                Swal.fire({
                text: "Debe completar todos los campos obligatorios",
                icon: 'warning'})
            } else {
                this.registrar_paciente()   
            }
        },

        async get_tipos_documentos(){
            const {data} = await authApi.get('/obtener_tipos_documento', {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })

            this.tipos_docs = data
        },

        async get_paises(){
            const {data} = await authApi.get('/obtener_paises', {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })

            this.paises = data
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
            //if(this.selectedDep){
                const {data} = await authApi.get('/obtener_ciudades', {
                    params: {
                        cod: this.selectedDep
                    },
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`
                    }
                })

                this.ciudades = data
            //}
        },

        async get_ciudades_residencia(){
            //if(this.selectedDepResi){
                const {data} = await authApi.get('/obtener_ciudades', {
                    params: {
                        cod: this.selectedDepResi
                    },
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`
                    }
                })

                this.ciudades_residencia = data
            //}
        },

        cambiar_pais(){
            if(this.selectedPais === 139){
                this.desactivar = false
                this.selectedDep = 0
                this.selectedCiu = 0
                this.get_ciudades()
            } else {
                this.desactivar = true
                this.selectedDep = null
                this.selectedCiu = null
            }
        },

        cambiar_ciudad(){
            if(this.selectedPais === 139){
                this.get_ciudades()

                if(this.selectedDep === 0) 
                    this.selectedCiu = 0
                else 
                    this.selectedCiu = (this.zeroFill(this.selectedDep, 2) + '01')*1
            }
        },

        cambiar_ciudad_residencia(){
            this.get_ciudades_residencia()
            if(this.selectedDepResi === 0) 
                    this.selectedCiuResi = 0
            else 
                this.selectedCiuResi = (this.zeroFill(this.selectedDepResi, 2) + '01')*1
        },
        
        zeroFill( number, width ) {
            width -= number.toString().length;
            if ( width > 0 ) {
                return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
            }

            return number + ""; // siempre devuelve tipo cadena
        },

        respuesta(msg, cod){
            if(cod === '0') {
                Swal.fire({
                title: msg,
                icon: 'success',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK',
                }).then(() => {
                    if( this.role === 1) this.$router.push({ name: 'lista-pacientes-admin' }).then(() => { this.$router.go() })
                    else this.$router.push({ name: 'lista-pacientes-prof' }).then(() => { this.$router.go() }) //VER!!!
                });
            } else if(cod === '999'){
                const {response} = msg
                const {data} = response

                Swal.fire({
                title: data,
                icon: 'error',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK',
                }).then(() => {
                    //this.$router.push('/')
                });
            } else {
                Swal.fire({
                title: msg,
                icon: 'error',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK',
                }).then(() => {
                    //this.$router.push('/')
                });
            }
        },

        reestructurar(){
            let obj = {}

            obj.role = 3
            obj.fec_nac = this.fec_nac
            obj.nac = this.selectedPais
            obj.lugar_nac = this.selectedPais === 139 ? this.selectedCiu : undefined
            obj.estado_civ = this.est_civ
            obj.genero = this.genero
            obj.tipo_doc = this.selectedDoc
            obj.lugar_residencia = this.selectedCiuResi

            if(this.direccion && this.direccion.trim().length !== 0) obj.direccion = this.direccion.trim(); else obj.direccion = null;
            if(this.username && this.username.trim().length !== 0) obj.username = this.username.trim(); else obj.username = null;
            if(this.email && this.email.trim().length !== 0) obj.email = this.email.trim(); else obj.email = null;
            if(this.pri_nom && this.pri_nom.trim().length !== 0) obj.pri_nombre = this.pri_nom.trim(); else obj.pri_nombre = null;
            if(this.seg_nom && this.seg_nom.trim().length !== 0) obj.seg_nombre = this.seg_nom.trim(); else delete obj.seg_nombre;
            if(this.ter_nom && this.ter_nom.trim().length !== 0) obj.ter_nombre = this.ter_nom.trim(); else delete  obj.ter_nombre;
            if(this.pri_ape && this.pri_ape.trim().length !== 0) obj.pri_apellido = this.pri_ape.trim(); else obj.pri_apellido = null;
            if(this.seg_ape && this.seg_ape.trim().length !== 0) obj.seg_apellido = this.seg_ape.trim(); else delete  obj.seg_apellido;
            if(this.nro_doc && this.nro_doc.trim().length !== 0) obj.nro_doc = this.nro_doc.trim(); else obj.nro_doc = null;
            if(this.ocu && this.ocu.trim().length !== 0) obj.ocu = this.ocu.trim(); else obj.ocu = null;
            if(this.telf && this.telf.trim().length !== 0) obj.telf_numb = this.telf.trim(); else obj.telf_numb = null;

            return obj
        },

        async registrar_paciente(){
            this.isLoading = true
            authApi.defaults.headers.common['Authorization'] = `Bearer ${this.accessToken}`

            const objeto = this.reestructurar()

            try {
                const {data} = await authApi.post('/pacientes', {
                    params: objeto 
                })

                this.respuesta(data.message, data.codigo)
            } catch (error) {
                this.isLoading = false
                this.respuesta(error, '999')
            }

            this.isLoading = false
        },

        regresar_atras(){
            console.log(this.role)
            if( this.role === 1) this.$router.push({ name: 'lista-pacientes-admin' })
            else this.$router.push({ name: 'lista-pacientes-prof' })
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
        /*margin-top: 1rem;*/
        margin-left: 3rem;
        margin-right: 3rem;
        border: 0;
        border-top: 1px solid black;
        padding: 10px;
    }

    .spinner-wrapper {
        background-color: gray;
        opacity:0.9;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 9999;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .spinner-border {
        height: 70px;
        width: 70px;
    }

    .text-otros {
        font-size: 30px;
    }
</style>