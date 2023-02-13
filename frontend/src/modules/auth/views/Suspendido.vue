<template>
    <section class="vh-100" style="background: linear-gradient(to right, #7cd175, #198754, #1d6042, #11653f)">
        <div class="container h-100">
            <div class="row d-flex justify-content-center align-items-center h-100">
                <div class="col-12 col-md-8 col-lg-6 col-xl-5">
                    <div class="card shadow-2-strong" style="border-radius: 15px;">
                        <div class="card-body p-5 text-center">

                            <img src="@/assets/logos/logo1.png" class="rounded mx-auto d-block" alt="logo" height="180" width="180">

                            <h2 class="mb-5" style="margin-top: 20px">Clínica VitalMente</h2>

                            <h6>Le informamos que su cuenta se encuentra inhabilitada.</h6>
                            <h6 style="color: red">Favor contactar con la administración</h6>

                            <div >
                                <button class="btn btn-primary btn-lg btn-block mt-3" @click="logOut">Cerrar sesión</button>
                            </div>                      
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    import store from '@/store'
    import Swal  from 'sweetalert2'

    export default {
        methods:{
            logOut(){
                Swal.fire({
                title: '¿Cerrar sesión?',
                //text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Confirmar',
                cancelButtonText: 'Cancelar'

                }).then((result) => {
                    if (result.isConfirmed) {
                        store.dispatch('auth/cerrar_sesion')
                        this.$router.push({name: 'login'})
                    }
                })
            }
        }
    }
</script>