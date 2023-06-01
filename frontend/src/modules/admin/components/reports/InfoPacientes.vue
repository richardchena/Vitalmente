<template>
    <div>
        <nav class="navbar" style="background: transparent">
            <div style="margin-left: 40px; margin-top: 7px; height: 30px; width: 600px;">
                <label style="font-size: 25px;">
                    <i class="fa fa-user-alt fa-lg"></i><strong>&nbsp;&nbsp; Total Pacientes: </strong>{{ pacientes.total }}
                </label>
            </div>
        </nav>
        <div class="container" style="width: 95%;">
            <div class="row columna">
                <div class="col-5">
                    <label style="font-weight: bold; margin-left: 15px; margin-bottom: 10px; margin-top: 10px;">
                        Pacientes por Sexo:
                    </label>

                    <br>

                    <label style="margin-left: 40px;">
                        <i class="fas fa-male"></i>&nbsp;&nbsp;Masculinos:<strong style="margin-left: 88px">{{ pacientes.masculino }}</strong>
                    </label>

                    <br>

                    <label style="margin-left: 40px;">
                        <i class="fas fa-female"></i>&nbsp;&nbsp;Femeninos:<strong style="margin-left: 89px">{{ pacientes.femenino }}</strong>
                    </label>

                    <br>

                    <label style="margin-left: 40px;">
                        <i class="fas fa-user fa-xs" style="margin-left: -1px;"></i>&nbsp;&nbsp;No menciona:<strong style="margin-left: 73px">{{ pacientes.otros }}</strong>
                    </label>
                </div>

                <div class="col-2 text-center" style="width: 10%;">
                    <div class="vertical-line"></div>
                </div>

                <div class="col-5">
                    <label style="font-weight: bold; margin-left: -5px; margin-bottom: 10px; margin-top: 10px;">
                        Pacientes por Edad:
                    </label>

                    <br>

                    <ul style="margin-left: 5px;">
                        <li>Menores (0 - 17):<strong style="margin-left: 75px">{{ pacientes.menores }}</strong></li>
                        <li>Adultos (18 - 65):<strong style="margin-left: 73px">{{ pacientes.adultos }}</strong></li>
                        <li>Adultos Mayores (+65):<strong style="margin-left: 33px">{{ pacientes.mayores }}</strong></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['pacientes']
}
</script>

<style scoped>
    .columna{
        border: 1px solid; 
        border-radius: 10px; 
        background-color: #e1dede; 
        margin-top: 10px;

    }

    div.vertical-line{
      width: 1px; 
      background-color: black;
      height: 100%;
      display: inline-block;
    }
</style>