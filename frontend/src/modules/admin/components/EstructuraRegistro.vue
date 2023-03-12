<template>
    <div>
        <div v-if="isLoading" class="spinner-wrapper">
            <div class="spinner-border text-otros">
                <span class="visually-hidden"></span>
            </div>
            <strong style="font-size: 25px; margin-left: 20px; margin-top:15px; color: black"><p>Modificando paciente... Aguarde por favor</p></strong>
        </div>

        <strong><p class="text-center">1- Datos Personales</p></strong>
        <hr>

        <div class="container">
            <div class="row">
                <div class="col-sm">
                    <label for="primer_nombre">Primer nombre <label style="color: red">*</label></label>
                    <input v-model="pri_nom" type="text" class="form-control" id="primer_nombre">
                </div>
                <div class="col-sm">
                    <label for="segundo_nombre">Segundo nombre</label>
                    <input v-model="seg_nom" type="text" class="form-control" id="segundo_nombre">
                </div>
                <div class="col-sm">
                    <label for="tercer_nombre">Tercer nombre</label>
                    <input v-model="ter_nom" type="text" class="form-control" id="tercer_nombre">
                </div>
            </div>
            <br>
            <div class="row">
                <div class="col-sm">
                    <label for="primer_apellido">Primer apellido <label style="color: red">*</label></label>
                    <input v-model="pri_ape" type="text" class="form-control" id="primer_apellido">
                </div>
                <div class="col-sm">
                    <label for="segundo_apellido">Segundo apellido</label>
                    <input v-model="seg_ape" type="text" class="form-control" id="segundo_apellido">
                </div>
                <div class="col-sm">
                    <label for="doc">Número de documento <label style="color: red">*</label></label>
                    <input v-model="nro_doc" type="text" class="form-control" id="doc">
                </div>
            </div>
            <br>
            <div class="row">
                <div class="col-sm">
                    <label for="inputState">Nacionalidad <label style="color: red">*</label></label>
                    <select v-model="selectedPais" class="form-control" @change="cambiar_pais">
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
                    <select v-model="selectedDep" class="form-control" :disabled="desactivar" @change="cambiar_ciudad">
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
                    <select v-model="selectedCiu" class="form-control" :disabled="desactivar"> 
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
                <div class="row">
                    <div class="col-sm-4" style="margin-right: 10px">
                        <label for="primer_apellido">Fecha de nacimiento <label style="color: red">*</label></label>
                        <input v-model="fec_nac" type="date" class="form-control" id="primer_apellido" :max="max_fecha">
                    </div>
                    <div class="col-sm-2">
                        <label for="inputState">Estado civil <label style="color: red">*</label></label>
                        <select v-model="est_civ" id="inputState" class="form-control">
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
                        <select v-model="genero" id="inputState" class="form-control">
                            <option selected value="P">Prefiero no decirlo</option>
                            <option value="M">Masculino</option>
                            <option value="F">Femenino</option>
                            <option value="O">Otro</option>
                        </select>
                    </div>
                    <div class="col-sm" style="margin-left: 8px">
                        <label for="ocupacion">Ocupación <label style="color: red">*</label></label>
                        <input v-model="ocu" type="text" class="form-control" id="ocupacion">
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
                    <label for="username">Username</label>
                    <input v-model="username" type="text" class="form-control" id="username" disabled>
                </div>
                <div class="col-sm">
                    <label for="email">Email <label style="color: red">*</label></label>
                    <input v-model="email" type="email" class="form-control" id="email">
                </div>
                <div class="col-sm">
                    <label for="ocupacion">Teléfono<label style="color: red">*</label></label>
                    <input v-model="telf" type="tel" class="form-control" id="telefono" pattern="[0-9]{4}-[0-9]{3}-[0-9]{3}" placeholder="Formato 09XX-XXX-XXX">
                </div>
            </div>
        </div>
        <br>
        <div class="modal-footer">
            <button class="btn" data-bs-dismiss="modal" style="background-color: #dc3545; color: white">Cancelar</button>
            <button class="btn" style="background-color: #f0820d; color: white" @click="validar">Modificar</button>
        </div>
    </div>
</template>

<script>
import authApi from '@/api/authApi'
import Swal  from 'sweetalert2'
import { mapGetters} from 'vuex'
import 'bootstrap'

    export default {
        props: {
            id_paciente: {
                type: Number,
                required: true
            },
        },

        async created(){
            await this.obtener_datos_iniciales();
            await this.get_paises();
            await this.get_departamentos();
            await this.get_ciudades();
        },

        computed:{
            ...mapGetters('auth', ['accessToken']),
        },

        watch: {
            async id_paciente() {
                await this.obtener_datos_iniciales();
                await this.get_paises();
                await this.get_departamentos();
                await this.get_ciudades();
            },
        },

        methods:{
            async modificar(){
                this.isLoading = true
                authApi.defaults.headers.common['Authorization'] = `Bearer ${this.accessToken}`

                const objeto = this.reestructurar()
                console.log(objeto);

                try {
                    const {data} = await authApi.put('/pacientes', objeto)
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    this.respuesta(data, '0')
                } catch (error) {
                    this.isLoading = false
                    this.respuesta(error, '999')
                }

                this.isLoading = false
            },

            respuesta(msg, cod){
                if(cod === '0') {
                    Swal.fire({
                    title: msg,
                    icon: 'success',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK',
                    }).then(() => {
                        //this.$router.push({name: 'lista-pacientes-admin'})
                        this.$router.go();
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

            validar(){
                if(!this.pri_nom  || !this.pri_ape || !this.fec_nac || !this.username || !this.email || !this.ocu || !this.telf || !this.nro_doc){
                    Swal.fire({
                    text: "Debe completar todos los campos obligatorios",
                    icon: 'warning'})
                } else {
                    this.modificar()   
                }
            },

            reestructurar(){
                let obj = {}

                obj.id_paciente = this.id_paciente
                obj.fec_nac = this.fec_nac
                obj.nac = this.selectedPais
                obj.lugar_nac = this.selectedPais === 139 ? this.selectedCiu : undefined
                obj.estado_civ = this.est_civ
                obj.genero = this.genero

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

            async obtener_datos_iniciales(){
                const {data} = await authApi.get('/pacientes/datos_paciente_modificar', {
                    params: {
                        id_paciente: this.id_paciente
                    },
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`
                    }
                })

                this.asignar(data);
            },

            asignar(user){
                this.pri_nom = user.primer_nombre;
                this.seg_nom = user.segundo_nombre;
                this.ter_nom = user.tercer_nombre;
                this.pri_ape = user.primer_apellido;
                this.seg_ape = user.segundo_apellido;
                this.nro_doc = user.nro_doc;
                this.fec_nac = user.fecha_nacimiento;
                this.ocu = user.ocupacion;
                this.telf = user.telefono;
                this.email = user.email;
                this.username = user.username;
                this.selectedDep = user.departamento_nac;
                this.selectedPais = user.nacionalidad;
                this.selectedCiu = user.ciudad_nac;
                this.est_civ = user.estado_civil;
                this.genero = user.genero;
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
                const {data} = await authApi.get('/obtener_ciudades', {
                    params: {
                        cod: this.selectedDep
                    },
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`
                    }
                })

                this.ciudades = data
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

            zeroFill( number, width ) {
                width -= number.toString().length;
                if ( width > 0 ) {
                    return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
                }

                return number + ""; // siempre devuelve tipo cadena
            },
        },

        data: function() {
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

                //
                selectedPais: 139,
                selectedDep: 0,
                selectedCiu: 0,

                // Extras
                desactivar: false,

                //
                isLoading: false,
            }
        }
    }
</script>

<style scoped>
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