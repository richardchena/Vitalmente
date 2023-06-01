<template>
    <div>
        <!--MODAL ACTUALIZAR-->
        <div class="modal fade bd-example-modal-lg" id="my_modal" ref="hola" data-bs-backdrop="static" role="dialog">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Actualizar datos del profesional #{{id_user_mod}}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>

                    <div class="modal-body">
                        <FormularioActualizar
                            :id_paciente=id_user_mod
                        />
                    </div>
                </div>
            </div>
        </div>

        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#my_modal" ref="boton" style="display: none;">
            boton oculto
        </button>
        <!--FIN MODAL-->

        <!--PAGINA PRINCIPAL-->
        <div v-if="isLoading" class="spinner-wrapper">
            <div class="spinner-border text-otros">
                <span class="visually-hidden"></span>
            </div>
            <strong style="font-size: 25px; margin-left: 20px; margin-top:15px; color: black"><p>{{msg}}... Aguarde por favor</p></strong>
        </div>

        <nav class="navbar" style="background: #c6c6c6">
            <div style="margin-left: 15px; margin-top: 7px; height: 30px">
                <strong>Lista de profesionales</strong>
            </div>

            <div class="d-flex flex-row align-items-center justify-content-center">
                <button class="btn btn-outline-dark" style="margin-right: 20px" @click="registrar_profesional">
                    <i class="fas fa-user-plus"></i>&nbsp;&nbsp;&nbsp;Alta de Profesional
                </button>

                <div class="form-group" style="margin-right: 12px">
                    <input type="text" class="form-control" id="buscador" style="width: 225px" placeholder='&#x1F50E;&#xFE0E; Realiza una búsqueda aquí' v-model="filtro">
                </div>
            </div>
        </nav>
        <div class="contendor_tabla">
            <table class="table table-hover table-cell-border table-striped" id="tabla">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre completo</th>
                    <th>Tipo documento</th>
                    <th>Nro. Documento</th>
                    <th>Registro</th>
                    <th>Residencia</th>
                    <th>Télefono</th>
                    <th>Status Account</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="user in users" :key="user.id">
                    <td>{{user.id}}</td>
                    <td>{{user.name}}</td>
                    <td>{{user.tipo_doc}}</td>
                    <td>{{user.nro_doc}}</td>
                    <td>{{user.registro}}</td>
                    <td>{{user.residencia}}</td>
                    <td>{{user.telefono}}</td>
                    <td>{{user.status}}</td>
                    <th></th>
                </tr>
                </tbody>
            </table>
        </div>
   </div>
</template>

<script>
    //Bootstrap and jQuery libraries
    import 'jquery/dist/jquery.min.js';
    //Datatable Modules
    import "datatables.net-dt/js/dataTables.dataTables"
    import "datatables.net-dt/css/jquery.dataTables.min.css"
    import * as $ from 'jquery';

    import {mapGetters} from 'vuex'
    import authApi from '@/api/authApi'
    import Swal  from 'sweetalert2'
    import 'bootstrap';
    import {defineAsyncComponent} from 'vue'

    export default {
        computed:{
            ...mapGetters('auth', ['accessToken'])
        },

        components: {
            FormularioActualizar: defineAsyncComponent(() => import ('@/modules/admin/components/EstructuraRegistroProfesional'))
        },


        data: function() {
            return {
                filtro: null,
                tabla: null,
                users: null,
                isLoading: false,
                msg: 'Actualizando datos',

                //DATOS DEL MODAL
                id_user_mod: 0
            }
        },

        methods: {
            modificar(id){
                this.id_user_mod = +id;
                this.$refs.boton.click();
            },

            registrar_profesional(){
                this.$router.push({ name: 'registrar-profesional-admin' })
            },

            async get_profesionales(){
                const {data} = await authApi.get('/profesionales', {
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`
                    }
                })
                this.users = data
            },

            async activar_desactivar(id){
                authApi.defaults.headers.common['Authorization'] = `Bearer ${this.accessToken}`

                try {
                    this.isLoading = true;
                    const {data} = await authApi.post(`/profesionales/cambiar_estado/${id}`)
                    this.msg = 'Actualizando estado del usuario'
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    this.isLoading = false;
                    this.$router.go();
                    console.log(data)

                } catch (error) {
                    this.isLoading = false;
                    console.log(error)
                }
            },

            eliminar(id, nombre){
                Swal.fire({
                html: `<strong><div style="font-size: 20px">¿Eliminar al profesional #${id} ${nombre}?</strong>`,
                //text: "¡Esta acción no se puede deshacer!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancelar'

                }).then((result) => {
                    if (result.isConfirmed) {
                        this.eliminar_bd(id);
                    }
                })
            },

            async eliminar_bd(id){
                authApi.defaults.headers.common['Authorization'] = `Bearer ${this.accessToken}`

                try {
                    this.isLoading = true;
                    const {data} = await authApi.delete(`/profesionales/eliminar_profesional/${id}`)
                    this.msg = 'Eliminando el usuario'
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    this.get_profesionales();
                    this.isLoading = false;
                    console.log(data)

                } catch (error) {
                    this.isLoading = false;
                    console.log(error)
                }
            },

            agenda(id){
                this.$router.push({name: 'agenda-profesional', params: {id_profesional: id}})
            }
        },

        async mounted(){
            await this.get_profesionales();

            const funcion_modificar = this.modificar;
            const function_eliminar = this.eliminar;
            const funcion_cambiar = this.activar_desactivar;
            const function_agenda = this.agenda;

            $(document).ready(function(){
                var tabla = $('#tabla').dataTable({
                    responsive: true,
                    destroy: true,
                    language: {
                        url: "//cdn.datatables.net/plug-ins/1.10.11/i18n/Spanish.json"
                    },
                    fixedColumns: true,
                    pageLength: 8,
                    lengthChange: false,
                    searching: true,
                    searchDelay: 0,
                    order: [],
                    dom: 'lrtip',
                    columns:[
                        {a: "id"},
                        {c: "name"},
                        {d: "nro_doc"},
                        {x: "registro"},
                        {e: "edad"},
                        {f: "genero"},
                        {g: "email"},
                        {i: "status"},
                        {
                            j: null, 
                            title: 'Controles',
                            orderable: false,
                            searchable: false,
                            render: function (data, type, row) {
                                let mod, dis, del, cal;

                                if(row[7] === 'Activa') {
                                    cal = '<button class="btn btn-success boton" title="Agenda profesional"><i class="far fa-calendar-alt"></i></button>'
                                    mod = '<button class="btn btn-info boton" title="Modificar registro"><i class="fas fa-pencil-alt"></i></button>';
                                    dis = '<button class="btn btn-warning boton" title="Desactivar cuenta"><i class="fas fa-user"></i></button>';
                                    del = '<button class="btn btn-danger boton" title="Eliminar"><i class="fas fa-trash-alt"></i></button>';
                                } else {
                                    cal = '<button class="btn btn-success boton" title="Agenda profesional"><i class="far fa-calendar-alt"></i></button>'
                                    mod = '<button class="btn btn-info boton" title="Modificar registro"><i class="fas fa-pencil-alt"></i></button>';
                                    dis = '<button class="btn btn-warning boton" title="Activar cuenta"><i class="fas fa-user-slash"></i></button>';
                                    del = '<button class="btn btn-danger boton" title="Eliminar"><i class="fas fa-trash-alt"></i></button>';
                                }

                                return cal + mod + dis + del;
                            }
                        }
                    ]
                }).api();

                $('#buscador').on('keyup change', function(){
                    tabla.search($(this).val()).draw();
                });

                $(".btn-info").click(function(){
                    funcion_modificar($(this).parents("tr").find("td").eq(0).html());
                });

                $(".btn-danger").click(function(){
                    function_eliminar($(this).parents("tr").find("td").eq(0).html(), $(this).parents("tr").find("td").eq(1).html());
                });

                $(".btn-success").click(function(){
                    function_agenda($(this).parents("tr").find("td").eq(0).html(), $(this).parents("tr").find("td").eq(1).html());
                });

                $(".btn-warning").click(function(){
                    funcion_cambiar($(this).parents("tr").find("td").eq(0).html());
                });
            })
        },
    }
</script>

<style>
    table{
        background-color: #ededed;
        text-align: left;
        width:100%;
        font-family: SF Pro Display sans-serif;
    }

    .boton{
        margin-right: 10px;
    }

    .contendor_tabla{
        padding: 15px;
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