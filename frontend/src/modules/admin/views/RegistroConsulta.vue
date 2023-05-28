<template>
    <div>
        <!--PAGINA CARGAR-->
        <div v-if="isLoading" class="spinner-wrapper">
            <div class="spinner-border text-otros">
                <span class="visually-hidden"></span>
            </div>
            <strong style="font-size: 25px; margin-left: 20px; margin-top:15px; color: black"><p>Registrando consulta... Aguarde por favor</p></strong>
        </div>

        <!--MODAL ACTUALIZAR-->
        <div class="modal fade bd-example-modal-lg" id="my_modal" ref="hola" data-bs-backdrop="static" role="dialog">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Actualizar datos del paciente #{{id_paciente}}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>

                    <div class="modal-body">
                        <FormularioActualizar
                            :id_paciente=+id_paciente
                        />
                    </div>
                </div>
            </div>
        </div>

        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#my_modal" ref="boton" style="display: none;">
            boton oculto
        </button>
        <!--FIN MODAL-->

        <!--INICIO TEMPLATE-->
        <nav class="navbar" style="background: #c6c6c6">
            <div style="margin-left: 15px; margin-top: 7px; height: 30px">
                <strong>Nueva consulta</strong>
            </div>

            <div class="d-flex flex-row align-items-center justify-content-center">
                <div class="d-flex flex-row align-items-center justify-content-center">
                    <div style="margin-right: 10px">
                        <button class="btn btn-warning" @click="modificar_datos_paciente" style="margin-right: 10px;">
                            MODIFICAR DATOS PACIENTE
                        </button>

                        <button class="btn btn-danger " @click="regresar_atras">
                            CANCELAR
                        </button>
                    </div>
                </div>
            </div>
        </nav>
        <div class="contenedor">
            <br>
            <strong><p class="text-center">Datos del paciente (Nro. {{id_paciente}})</p></strong>
            <hr>

            <div class="container">
                <div class="row">
                    <div class="col-sm">
                        <strong><p class="text-left">Nombre completo: {{nombre}}</p></strong>
                        <strong><p class="text-left">Estado Civil y Género: {{estado_civil}} - {{genero}}</p></strong>
                    </div>
                    <div class="col-sm">
                        <strong><p class="text-center">Edad: {{edad}} años</p></strong>
                        <strong><p class="text-center">Ocupación: {{ocupacion}}</p></strong>
                    </div>
                    <div class="col-sm">
                        <strong><p class="text-left">Número de documento: {{nro_doc}}</p></strong>
                        <strong><p class="text-left">Lugar de nacimiento: {{pais}} - {{ciudad}}</p></strong>
                    </div>
                </div>
            </div>
    
        </div>

        <div style="padding: 5px 55px 0px 55px">
            <div  v-if="role === 1" class="btn-group d-flex w-100" role="group"> 
                <router-link 
                    :to="{ name: 'datos-historial-consultas-admin',
                           params: { id: $route.params.id}}"
                    tag="button" 
                    class="btn btn-b_no_act w-100">
                    Datos generales
                </router-link>
                <router-link 
                    :to="{ name: 'datos-historial-consultas-texto-admin',
                           params: { id: $route.params.id}}"
                    tag="button" 
                    class="btn btn-b_no_act w-100">
                    Historial clínico
                </router-link>
            </div>
            <div v-else class="btn-group d-flex w-100" role="group">
                <router-link 
                    :to="{ name: 'datos-historial-consultas-prof',
                           params: { id: $route.params.id}}"
                    tag="button" 
                    class="btn btn-b_no_act w-100">
                    Datos generales
                </router-link>
                <router-link 
                    :to="{ name: 'datos-historial-consultas-texto-prof',
                           params: { id: $route.params.id, id_esp: $route.params.id_esp}}"
                    tag="button" 
                    class="btn btn-b_no_act w-100">
                    Historial clínico
                </router-link>
            </div>
        </div>

        <router-view v-slot="{ Component }">
            <keep-alive>
                <component :is="Component" />
            </keep-alive>
        </router-view>
    </div>
</template>

<script>
import { mapGetters} from 'vuex'
import Swal  from 'sweetalert2'
import authApi from '@/api/authApi'
import {defineAsyncComponent} from 'vue'
import 'bootstrap';


export default {
    created(){
        document.title = 'Registrar nueva consulta'
        this.iniciar()
    },

    computed:{
        ...mapGetters('auth', ['accessToken', 'role']),
    },

    components: {
        FormularioActualizar: defineAsyncComponent(() => import ('@/modules/admin/components/EstructuraRegistro'))
    },

    data() {
        return {
            id_paciente: this.$route.params.id,
            nombre: null,
            edad: null,
            nro_doc: null,
            ocupacion: null,
            pais: null,
            ciudad: null,
            estado_civil: null,
            genero: null,
            select_especialidad: 1,

            //LISTA
            especialidades: null,

            //CONSULTA
            motivo_consulta: null,
            tecnica_consulta: null,
            diagnostico_consulta: null,
            antecedente_consulta: null,

            //
            isLoading: false,
        }
    },

    methods: {
        validar(){
            if(!this.diagnostico_consulta || !this.motivo_consulta){
                Swal.fire({
                text: "Debe completar el motivo de consulta y diagnóstico actual",
                icon: 'warning'})
            } else {
                this.registrar()   
            }
        },

        obtener_object(){
            let obj = {}
            obj.id_paciente = +this.id_paciente
            obj.id_profesional = 10 //CAMBIARRRRR
            obj.id_especialidad = this.select_especialidad
            obj.motivo = this.motivo_consulta
            obj.diagnostico = this.diagnostico_consulta

            if(this.tecnica && this.tecnica.trim().length !== 0) obj.tecnica = this.tecnica.trim(); else delete obj.tecnica;
            if(this.antecedente_consulta && this.antecedente_consulta.trim().length !== 0) obj.antecedente = this.antecedente_consulta.trim(); else delete obj.antecedente;

            return obj
        },

        respuesta(msg, cod){
            if(cod === '0') {
                Swal.fire({
                title: msg,
                icon: 'success',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK',
                }).then(() => {
                    this.$router.push({name: 'historial-consultas-admin', params:{
                        id: this.id_paciente
                    }})
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

        async registrar(){
            this.isLoading = true
            authApi.defaults.headers.common['Authorization'] = `Bearer ${this.accessToken}`

            const objeto = this.obtener_object()
            console.log(objeto);

            try {
                const {data} = await authApi.post('/consultas', objeto)
                await new Promise(resolve => setTimeout(resolve, 1500));
                this.respuesta(data, '0')
            } catch (error) {
                this.isLoading = false
                this.respuesta(error, '999')
            }

            this.isLoading = false
        },

        modificar_datos_paciente(){
            this.$refs.boton.click();
        },

        regresar_atras(){
            if(this.role === 1) {
                this.$router.push({ name: 'historial-consultas-admin', params: {
                    id: this.id_paciente
                }});
            } else {
                this.$router.push({ name: 'historial-consultas-prof', params: {
                    id: this.id_paciente
                }});
            }

        },

        async iniciar(){
            if(isNaN(this.$route.params.id) || this.$route.params.id === '0') {
                Swal.fire({
                title: 'El ID es inválido',
                icon: 'error',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK',
                backdrop: `rgba(128,128,128,0.9)`
                }).then(() => {
                    this.$router.push({ name: 'menu-admin' });
                })
            }

            await this.obtener_especialidades()
            await this.obtener_datos_paciente()

            if(!this.nombre) {
                Swal.fire({
                title: 'No existe el paciente solicitado',
                icon: 'error',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK',
                backdrop: `rgba(128,128,128,0.9)`
                }).then(() => {
                    this.$router.push({ name: 'menu-admin' });
                })
            }
        },

        async obtener_especialidades(){
            const {data} = await authApi.get('/obtener_especialidades', {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })

            this.especialidades = data
        },

        async obtener_datos_paciente(){
            const {data} = await authApi.get('/pacientes/consulta_datos_paciente', {
                params: {
                    id_paciente: this.id_paciente
                },
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })

            this.nombre = data.nombre_completo
            this.edad = data.edad
            this.genero = data.genero
            this.ciudad = data.ciudad
            this.pais = data.pais
            this.ocupacion = data.ocupacion
            this.estado_civil = data.est_civ
            this.nro_doc = data.nro_doc
        },
    }
}
</script>

<style scoped>
    .contenedor{
        background-color: #ededed;
    }

    hr {
        margin-left: 3rem;
        margin-right: 3rem;
        border: 0;
        border-top: 1px solid black; 
    }

    textarea{
        border:1px solid black;
    }

    textarea:focus {
        outline: none !important;
        border:1px solid gray;
        box-shadow: 0 0 10px #719ECE;
    }

    select{
        background-color: transparent;
        border: none;
    }

    select:focus {
        border: none;
        outline: none !important;
        box-shadow: none;
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

    a.router-link-exact-active {
        background-color: #8d8d8d;
        color: white;
    }
</style>