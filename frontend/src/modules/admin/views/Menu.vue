<template>
    <div>
        <nav class="navbar" style="background: #c6c6c6">
            <div style="margin-left: 15px; margin-top: 7px; height: 30px">
                <strong>Menú principal</strong>
            </div>
        </nav>
        <br><br>
        <div class="container text-center">
            <div class="row">
                <div class="col-md">
                    <button class="btn btn-primary mx-2 btn-lg btn-block" @click="pagina_paciente">
                        Pacientes&nbsp;
                        <i class="fas fa-users"></i>
                    </button>
                </div>
                <div class="col-md">
                    <button class="btn btn-secondary mx-2 btn-lg btn-block" @click="logOut">
                        Profesionales&nbsp;
                        <i class="fas fa-hospital-user"></i>
                    </button>
                </div>
                <div class="col-md">
                    <button class="btn btn-info mx-2 btn-lg btn-block" @click="logOut">
                        Administradores&nbsp;
                        <i class="fas fa-users-cog"></i> 
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    methods: {
        pagina_paciente(){
            this.$router.push({ name: 'lista-pacientes-admin' })
        }
    }
}
</script>