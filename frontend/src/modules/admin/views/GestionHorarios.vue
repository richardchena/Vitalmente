<template>
    <div>
        <nav class="navbar" style="background: #c6c6c6">
            <div style="margin-left: 15px; margin-top: 7px; height: 30px;">
                <strong>Rango de la agenda</strong>
            </div>
            <div style="position: absolute; margin-left: 240px">
                <VueDatePicker 
                    v-model="fecha_inicio"
                    placeholder="Fecha inicio"
                    locale="es-PY"
                    :enable-time-picker="false"
                    :min-date="new Date()"
                    :max-date="fecha_maxima_registro"
                    :disabled-week-days="[0]"
                    :format="formato_fecha"
                    week-start="0"
                    :day-names="dias_semana"
                    select-text="OK"
                    cancel-text="Cancelar"
                    :markers="marcadores"
                    :disabled-dates="dias_desactivados"
                    hide-offset-dates
                >
                <template #calendar-header="{  day }">
                    <div v-if="day === 'Do'" class="text-danger">
                        {{ day }}
                    </div>
                    <div v-else>
                        {{ day }}
                    </div>
                </template>
                </VueDatePicker>
            </div>

            <div style="position: absolute;  margin-left: 500px">
                <VueDatePicker 
                    v-model="fecha_fin"
                    placeholder="Fecha finalización"
                    locale="es-PY"
                    :enable-time-picker="false"
                    :min-date="new Date()"
                    :max-date="fecha_maxima_registro"
                    :disabled-week-days="[0]"
                    :format="formato_fecha"
                    week-start="0"
                    :day-names="dias_semana"
                    select-text="OK"
                    cancel-text="Cancelar"
                    :markers="marcadores"
                    :disabled-dates="dias_desactivados"
                    hide-offset-dates
                >
                <template #calendar-header="{  day }">
                    <div v-if="day === 'Do'" class="text-danger">
                        {{ day }}
                    </div>
                    <div v-else>
                        {{ day }}
                    </div>
                </template>
                </VueDatePicker>
            </div>

            <div class="d-flex flex-row align-items-center justify-content-center">
                <div class="d-flex flex-row align-items-center justify-content-center">
                    <div style="margin-right: 10px">
                        <button class="btn btn-success" style="margin-right: 10px" @click="validar">
                            REGISTRAR
                        </button>
                        <button class="btn btn-danger " @click="regresar_atras">
                            CANCELAR
                        </button>
                    </div>
                </div>
            </div>
        </nav>

        <br>

        <i><p class="text-center">{{msg}}</p></i>

        <hr>

        <div class="container">
            <table class="table table-hover table-cell-border table-striped" id="tabla">
                <thead>
                    <tr>
                        <th>Día</th>
                        <th>Activo</th>
                        <th>Turno Mañana</th>
                        <th>Turno Tarde</th>
                        <th>Especialidad</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <div style="margin-top: 5px">
                                LUNES
                            </div>
                        </td>
                        <td style="width: 200px">
                            <div class="form-check form-switch d-flex justify-content-center">
                                <input v-model=dias_consulta[0] class="form-check-input" type="checkbox" checked>
                            </div>
                        </td>
                        <td>
                            <div class="row">
                                <div class="col-sm">
                                    <div class='form-time-input'>
                                        <VueDatePicker
                                            v-model="turno_dia[0][0]"
                                            placeholder="Inicio"
                                            :state="null"
                                            select-text="OK"
                                            cancel-text="Cancelar"
                                            mode-height="120"
                                            :start-time="{ hours: 7, minutes: 0 }"
                                            :min-time="{ hours: 7, minutes: 0 }"
                                            :max-time="{ hours: 12, minutes: 0 }"
                                            minutes-increment="30"
                                            no-minutes-overlay
                                            time-picker
                                        >
                                            <template #input-icon>
                                                <div style="margin-left: 12px">
                                                    <i class="far fa-clock"></i>
                                                </div>
                                            </template>
                                        </VueDatePicker>
                                    </div>
                                </div>
                                <div class="col-sm">
                                    <div class='form-time-input'>
                                        <VueDatePicker
                                            v-model="turno_dia[0][1]"
                                            placeholder="Fin"
                                            :state="null"
                                            select-text="OK"
                                            cancel-text="Cancelar"
                                            mode-height="120"
                                            :start-time="{ hours: 7, minutes: 0 }"
                                            :min-time="{ hours: 7, minutes: 0 }"
                                            :max-time="{ hours: 12, minutes: 0 }"
                                            minutes-increment="30"
                                            no-minutes-overlay
                                            time-picker
                                        >
                                            <template #input-icon>
                                                <div style="margin-left: 12px">
                                                    <i class="far fa-clock"></i>
                                                </div>
                                            </template>
                                        </VueDatePicker>
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td>
                            <div class="row">
                                <div class="col-sm">
                                    <div class='form-time-input'>
                                        <VueDatePicker
                                            v-model="turno_tarde[0][0]"
                                            placeholder="Inicio"
                                            :state="null"
                                            select-text="OK"
                                            cancel-text="Cancelar"
                                            mode-height="120"
                                            :start-time="{ hours: 13, minutes: 0 }"
                                            :min-time="{ hours: 13, minutes: 0 }"
                                            :max-time="{ hours: 21, minutes: 0 }"
                                            minutes-increment="30"
                                            no-minutes-overlay
                                            time-picker
                                        >
                                            <template #input-icon>
                                                <div style="margin-left: 12px">
                                                    <i class="far fa-clock"></i>
                                                </div>
                                            </template>
                                        </VueDatePicker>
                                    </div>
                                </div>
                                <div class="col-sm">
                                    <div class='form-time-input'>
                                        <VueDatePicker
                                            v-model="turno_tarde[0][1]"
                                            placeholder="Fin"
                                            :state="null"
                                            select-text="OK"
                                            cancel-text="Cancelar"
                                            mode-height="120"
                                            :start-time="{ hours: 13, minutes: 0 }"
                                            :min-time="{ hours: 13, minutes: 0 }"
                                            :max-time="{ hours: 21, minutes: 0 }"
                                            minutes-increment="30"
                                            no-minutes-overlay
                                            time-picker
                                        >
                                            <template #input-icon>
                                                <div style="margin-left: 12px">
                                                    <i class="far fa-clock"></i>
                                                </div>
                                            </template>
                                        </VueDatePicker>
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td>
                            <div class="d-flex justify-content-center">
                                <select v-model="dias_especialidad[0]" class="form-select" @change="cambiar_especialidad">
                                    <option 
                                        v-for="item in especialidades" 
                                        :key="item.id_especialidad"
                                        :value="item.id_especialidad"
                                    >
                                        {{item.descripcion}}
                                    </option>
                                </select>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div style="margin-top: 5px">
                                MARTES
                            </div>
                        </td>
                        <td style="width: 200px">
                            <div class="form-check form-switch d-flex justify-content-center">
                                <input v-model=dias_consulta[1] class="form-check-input" type="checkbox" checked>
                            </div>
                        </td>
                        <td>
                            <div class="row">
                                <div class="col-sm">
                                    <div class='form-time-input'>
                                        <VueDatePicker
                                            v-model="turno_dia[1][0]"
                                            placeholder="Inicio"
                                            :state="null"
                                            select-text="OK"
                                            cancel-text="Cancelar"
                                            mode-height="120"
                                            :start-time="{ hours: 7, minutes: 0 }"
                                            :min-time="{ hours: 7, minutes: 0 }"
                                            :max-time="{ hours: 12, minutes: 0 }"
                                            minutes-increment="30"
                                            no-minutes-overlay
                                            time-picker
                                        >
                                            <template #input-icon>
                                                <div style="margin-left: 12px">
                                                    <i class="far fa-clock"></i>
                                                </div>
                                            </template>
                                        </VueDatePicker>
                                    </div>
                                </div>
                                <div class="col-sm">
                                    <div class='form-time-input'>
                                        <VueDatePicker
                                            v-model="turno_dia[1][1]"
                                            placeholder="Fin"
                                            :state="null"
                                            select-text="OK"
                                            cancel-text="Cancelar"
                                            mode-height="120"
                                            :start-time="{ hours: 7, minutes: 0 }"
                                            :min-time="{ hours: 7, minutes: 0 }"
                                            :max-time="{ hours: 12, minutes: 0 }"
                                            minutes-increment="30"
                                            no-minutes-overlay
                                            time-picker
                                        >
                                            <template #input-icon>
                                                <div style="margin-left: 12px">
                                                    <i class="far fa-clock"></i>
                                                </div>
                                            </template>
                                        </VueDatePicker>
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td>
                            <div class="row">
                                <div class="col-sm">
                                    <div class='form-time-input'>
                                        <VueDatePicker
                                            v-model="turno_tarde[1][0]"
                                            placeholder="Inicio"
                                            :state="null"
                                            select-text="OK"
                                            cancel-text="Cancelar"
                                            mode-height="120"
                                            :start-time="{ hours: 13, minutes: 0 }"
                                            :min-time="{ hours: 13, minutes: 0 }"
                                            :max-time="{ hours: 21, minutes: 0 }"
                                            minutes-increment="30"
                                            no-minutes-overlay
                                            time-picker
                                        >
                                            <template #input-icon>
                                                <div style="margin-left: 12px">
                                                    <i class="far fa-clock"></i>
                                                </div>
                                            </template>
                                        </VueDatePicker>
                                    </div>
                                </div>
                                <div class="col-sm">
                                    <div class='form-time-input'>
                                        <VueDatePicker
                                            v-model="turno_tarde[1][1]"
                                            placeholder="Fin"
                                            :state="null"
                                            select-text="OK"
                                            cancel-text="Cancelar"
                                            mode-height="120"
                                            :start-time="{ hours: 13, minutes: 0 }"
                                            :min-time="{ hours: 13, minutes: 0 }"
                                            :max-time="{ hours: 21, minutes: 0 }"
                                            minutes-increment="30"
                                            no-minutes-overlay
                                            time-picker
                                        >
                                            <template #input-icon>
                                                <div style="margin-left: 12px">
                                                    <i class="far fa-clock"></i>
                                                </div>
                                            </template>
                                        </VueDatePicker>
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td>
                            <div class="d-flex justify-content-center">
                                <select v-model="dias_especialidad[1]" class="form-select" @change="cambiar_especialidad">
                                    <option 
                                        v-for="item in especialidades" 
                                        :key="item.id_especialidad"
                                        :value="item.id_especialidad"
                                    >
                                        {{item.descripcion}}
                                    </option>
                                </select>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div style="margin-top: 5px">
                                MIÉRCOLES
                            </div>
                        </td>
                        <td style="width: 200px">
                            <div class="form-check form-switch d-flex justify-content-center">
                                <input v-model=dias_consulta[2] class="form-check-input" type="checkbox" checked>
                            </div>
                        </td>
                        <td>
                            <div class="row">
                                <div class="col-sm">
                                    <div class='form-time-input'>
                                        <VueDatePicker
                                            v-model="turno_dia[2][0]"
                                            placeholder="Inicio"
                                            :state="null"
                                            select-text="OK"
                                            cancel-text="Cancelar"
                                            mode-height="120"
                                            :start-time="{ hours: 7, minutes: 0 }"
                                            :min-time="{ hours: 7, minutes: 0 }"
                                            :max-time="{ hours: 12, minutes: 0 }"
                                            minutes-increment="30"
                                            no-minutes-overlay
                                            time-picker
                                        >
                                            <template #input-icon>
                                                <div style="margin-left: 12px">
                                                    <i class="far fa-clock"></i>
                                                </div>
                                            </template>
                                        </VueDatePicker>
                                    </div>
                                </div>
                                <div class="col-sm">
                                    <div class='form-time-input'>
                                        <VueDatePicker
                                            v-model="turno_dia[2][1]"
                                            placeholder="Fin"
                                            :state="null"
                                            select-text="OK"
                                            cancel-text="Cancelar"
                                            mode-height="120"
                                            :start-time="{ hours: 7, minutes: 0 }"
                                            :min-time="{ hours: 7, minutes: 0 }"
                                            :max-time="{ hours: 12, minutes: 0 }"
                                            minutes-increment="30"
                                            no-minutes-overlay
                                            time-picker
                                        >
                                            <template #input-icon>
                                                <div style="margin-left: 12px">
                                                    <i class="far fa-clock"></i>
                                                </div>
                                            </template>
                                        </VueDatePicker>
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td>
                            <div class="row">
                                <div class="col-sm">
                                    <div class='form-time-input'>
                                        <VueDatePicker
                                            v-model="turno_tarde[2][0]"
                                            placeholder="Inicio"
                                            :state="null"
                                            select-text="OK"
                                            cancel-text="Cancelar"
                                            mode-height="120"
                                            :start-time="{ hours: 13, minutes: 0 }"
                                            :min-time="{ hours: 13, minutes: 0 }"
                                            :max-time="{ hours: 21, minutes: 0 }"
                                            minutes-increment="30"
                                            no-minutes-overlay
                                            time-picker
                                        >
                                            <template #input-icon>
                                                <div style="margin-left: 12px">
                                                    <i class="far fa-clock"></i>
                                                </div>
                                            </template>
                                        </VueDatePicker>
                                    </div>
                                </div>
                                <div class="col-sm">
                                    <div class='form-time-input'>
                                        <VueDatePicker
                                            v-model="turno_tarde[2][1]"
                                            placeholder="Fin"
                                            :state="null"
                                            select-text="OK"
                                            cancel-text="Cancelar"
                                            mode-height="120"
                                            :start-time="{ hours: 13, minutes: 0 }"
                                            :min-time="{ hours: 13, minutes: 0 }"
                                            :max-time="{ hours: 21, minutes: 0 }"
                                            minutes-increment="30"
                                            no-minutes-overlay
                                            time-picker
                                        >
                                            <template #input-icon>
                                                <div style="margin-left: 12px">
                                                    <i class="far fa-clock"></i>
                                                </div>
                                            </template>
                                        </VueDatePicker>
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td>
                            <div class="d-flex justify-content-center">
                                <select v-model="dias_especialidad[2]" class="form-select" @change="cambiar_especialidad">
                                    <option 
                                        v-for="item in especialidades" 
                                        :key="item.id_especialidad"
                                        :value="item.id_especialidad"
                                    >
                                        {{item.descripcion}}
                                    </option>
                                </select>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div style="margin-top: 5px">
                                JUEVES
                            </div>
                        </td>
                        <td style="width: 200px">
                            <div class="form-check form-switch d-flex justify-content-center">
                                <input v-model=dias_consulta[3] class="form-check-input" type="checkbox" checked>
                            </div>
                        </td>
                        <td>
                            <div class="row">
                                <div class="col-sm">
                                    <div class='form-time-input'>
                                        <VueDatePicker
                                            v-model="turno_dia[3][0]"
                                            placeholder="Inicio"
                                            :state="null"
                                            select-text="OK"
                                            cancel-text="Cancelar"
                                            mode-height="120"
                                            :start-time="{ hours: 7, minutes: 0 }"
                                            :min-time="{ hours: 7, minutes: 0 }"
                                            :max-time="{ hours: 12, minutes: 0 }"
                                            minutes-increment="30"
                                            no-minutes-overlay
                                            time-picker
                                        >
                                            <template #input-icon>
                                                <div style="margin-left: 12px">
                                                    <i class="far fa-clock"></i>
                                                </div>
                                            </template>
                                        </VueDatePicker>
                                    </div>
                                </div>
                                <div class="col-sm">
                                    <div class='form-time-input'>
                                        <VueDatePicker
                                            v-model="turno_dia[3][1]"
                                            placeholder="Fin"
                                            :state="null"
                                            select-text="OK"
                                            cancel-text="Cancelar"
                                            mode-height="120"
                                            :start-time="{ hours: 7, minutes: 0 }"
                                            :min-time="{ hours: 7, minutes: 0 }"
                                            :max-time="{ hours: 12, minutes: 0 }"
                                            minutes-increment="30"
                                            no-minutes-overlay
                                            time-picker
                                        >
                                            <template #input-icon>
                                                <div style="margin-left: 12px">
                                                    <i class="far fa-clock"></i>
                                                </div>
                                            </template>
                                        </VueDatePicker>
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td>
                            <div class="row">
                                <div class="col-sm">
                                    <div class='form-time-input'>
                                        <VueDatePicker
                                            v-model="turno_tarde[3][0]"
                                            placeholder="Inicio"
                                            :state="null"
                                            select-text="OK"
                                            cancel-text="Cancelar"
                                            mode-height="120"
                                            :start-time="{ hours: 13, minutes: 0 }"
                                            :min-time="{ hours: 13, minutes: 0 }"
                                            :max-time="{ hours: 21, minutes: 0 }"
                                            minutes-increment="30"
                                            no-minutes-overlay
                                            time-picker
                                        >
                                            <template #input-icon>
                                                <div style="margin-left: 12px">
                                                    <i class="far fa-clock"></i>
                                                </div>
                                            </template>
                                        </VueDatePicker>
                                    </div>
                                </div>
                                <div class="col-sm">
                                    <div class='form-time-input'>
                                        <VueDatePicker
                                            v-model="turno_tarde[3][1]"
                                            placeholder="Fin"
                                            :state="null"
                                            select-text="OK"
                                            cancel-text="Cancelar"
                                            mode-height="120"
                                            :start-time="{ hours: 13, minutes: 0 }"
                                            :min-time="{ hours: 13, minutes: 0 }"
                                            :max-time="{ hours: 21, minutes: 0 }"
                                            minutes-increment="30"
                                            no-minutes-overlay
                                            time-picker
                                        >
                                            <template #input-icon>
                                                <div style="margin-left: 12px">
                                                    <i class="far fa-clock"></i>
                                                </div>
                                            </template>
                                        </VueDatePicker>
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td>
                            <div class="d-flex justify-content-center">
                                <select v-model="dias_especialidad[3]" class="form-select" @change="cambiar_especialidad">
                                    <option 
                                        v-for="item in especialidades" 
                                        :key="item.id_especialidad"
                                        :value="item.id_especialidad"
                                    >
                                        {{item.descripcion}}
                                    </option>
                                </select>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div style="margin-top: 5px">
                                VIERNES
                            </div>
                        </td>
                        <td style="width: 200px">
                            <div class="form-check form-switch d-flex justify-content-center">
                                <input v-model=dias_consulta[4] class="form-check-input" type="checkbox" checked>
                            </div>
                        </td>
                        <td>
                            <div class="row">
                                <div class="col-sm">
                                    <div class='form-time-input'>
                                        <VueDatePicker
                                            v-model="turno_dia[4][0]"
                                            placeholder="Inicio"
                                            :state="null"
                                            select-text="OK"
                                            cancel-text="Cancelar"
                                            mode-height="120"
                                            :start-time="{ hours: 7, minutes: 0 }"
                                            :min-time="{ hours: 7, minutes: 0 }"
                                            :max-time="{ hours: 12, minutes: 0 }"
                                            minutes-increment="30"
                                            no-minutes-overlay
                                            time-picker
                                        >
                                            <template #input-icon>
                                                <div style="margin-left: 12px">
                                                    <i class="far fa-clock"></i>
                                                </div>
                                            </template>
                                        </VueDatePicker>
                                    </div>
                                </div>
                                <div class="col-sm">
                                    <div class='form-time-input'>
                                        <VueDatePicker
                                            v-model="turno_dia[4][1]"
                                            placeholder="Fin"
                                            :state="null"
                                            select-text="OK"
                                            cancel-text="Cancelar"
                                            mode-height="120"
                                            :start-time="{ hours: 7, minutes: 0 }"
                                            :min-time="{ hours: 7, minutes: 0 }"
                                            :max-time="{ hours: 12, minutes: 0 }"
                                            minutes-increment="30"
                                            no-minutes-overlay
                                            time-picker
                                        >
                                            <template #input-icon>
                                                <div style="margin-left: 12px">
                                                    <i class="far fa-clock"></i>
                                                </div>
                                            </template>
                                        </VueDatePicker>
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td>
                            <div class="row">
                                <div class="col-sm">
                                    <div class='form-time-input'>
                                        <VueDatePicker
                                            v-model="turno_tarde[4][0]"
                                            placeholder="Inicio"
                                            :state="null"
                                            select-text="OK"
                                            cancel-text="Cancelar"
                                            mode-height="120"
                                            :start-time="{ hours: 13, minutes: 0 }"
                                            :min-time="{ hours: 13, minutes: 0 }"
                                            :max-time="{ hours: 21, minutes: 0 }"
                                            minutes-increment="30"
                                            no-minutes-overlay
                                            time-picker
                                        >
                                            <template #input-icon>
                                                <div style="margin-left: 12px">
                                                    <i class="far fa-clock"></i>
                                                </div>
                                            </template>
                                        </VueDatePicker>
                                    </div>
                                </div>
                                <div class="col-sm">
                                    <div class='form-time-input'>
                                        <VueDatePicker
                                            v-model="turno_tarde[4][1]"
                                            placeholder="Fin"
                                            :state="null"
                                            select-text="OK"
                                            cancel-text="Cancelar"
                                            mode-height="120"
                                            :start-time="{ hours: 13, minutes: 0 }"
                                            :min-time="{ hours: 13, minutes: 0 }"
                                            :max-time="{ hours: 21, minutes: 0 }"
                                            minutes-increment="30"
                                            no-minutes-overlay
                                            time-picker
                                        >
                                            <template #input-icon>
                                                <div style="margin-left: 12px">
                                                    <i class="far fa-clock"></i>
                                                </div>
                                            </template>
                                        </VueDatePicker>
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td>
                            <div class="d-flex justify-content-center">
                                <select v-model="dias_especialidad[4]" class="form-select" @change="cambiar_especialidad">
                                    <option 
                                        v-for="item in especialidades" 
                                        :key="item.id_especialidad"
                                        :value="item.id_especialidad"
                                    >
                                        {{item.descripcion}}
                                    </option>
                                </select>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div style="margin-top: 5px">
                                SÁBADO
                            </div>
                        </td>
                        <td style="width: 200px">
                            <div class="form-check form-switch d-flex justify-content-center">
                                <input v-model=dias_consulta[5] class="form-check-input" type="checkbox" checked>
                            </div>
                        </td>
                        <td>
                            <div class="row">
                                <div class="col-sm">
                                    <div class='form-time-input'>
                                        <VueDatePicker
                                            v-model="turno_dia[5][0]"
                                            placeholder="Inicio"
                                            :state="null"
                                            select-text="OK"
                                            cancel-text="Cancelar"
                                            mode-height="120"
                                            :start-time="{ hours: 7, minutes: 0 }"
                                            :min-time="{ hours: 7, minutes: 0 }"
                                            :max-time="{ hours: 12, minutes: 0 }"
                                            minutes-increment="30"
                                            no-minutes-overlay
                                            time-picker
                                        >
                                            <template #input-icon>
                                                <div style="margin-left: 12px">
                                                    <i class="far fa-clock"></i>
                                                </div>
                                            </template>
                                        </VueDatePicker>
                                    </div>
                                </div>
                                <div class="col-sm">
                                    <div class='form-time-input'>
                                        <VueDatePicker
                                            v-model="turno_dia[5][1]"
                                            placeholder="Fin"
                                            :state="null"
                                            select-text="OK"
                                            cancel-text="Cancelar"
                                            mode-height="120"
                                            :start-time="{ hours: 7, minutes: 0 }"
                                            :min-time="{ hours: 7, minutes: 0 }"
                                            :max-time="{ hours: 12, minutes: 0 }"
                                            minutes-increment="30"
                                            no-minutes-overlay
                                            time-picker
                                        >
                                            <template #input-icon>
                                                <div style="margin-left: 12px">
                                                    <i class="far fa-clock"></i>
                                                </div>
                                            </template>
                                        </VueDatePicker>
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td>
                            <div class="row">
                                <div class="col-sm">
                                    <div class='form-time-input'>
                                        <VueDatePicker
                                            v-model="turno_tarde[5][0]"
                                            placeholder="Inicio"
                                            :state="null"
                                            select-text="OK"
                                            cancel-text="Cancelar"
                                            mode-height="120"
                                            :start-time="{ hours: 13, minutes: 0 }"
                                            :min-time="{ hours: 13, minutes: 0 }"
                                            :max-time="{ hours: 21, minutes: 0 }"
                                            minutes-increment="30"
                                            no-minutes-overlay
                                            time-picker
                                        >
                                            <template #input-icon>
                                                <div style="margin-left: 12px">
                                                    <i class="far fa-clock"></i>
                                                </div>
                                            </template>
                                        </VueDatePicker>
                                    </div>
                                </div>
                                <div class="col-sm">
                                    <div class='form-time-input'>
                                        <VueDatePicker
                                            v-model="turno_tarde[5][1]"
                                            placeholder="Fin"
                                            :state="null"
                                            select-text="OK"
                                            cancel-text="Cancelar"
                                            mode-height="120"
                                            :start-time="{ hours: 13, minutes: 0 }"
                                            :min-time="{ hours: 13, minutes: 0 }"
                                            :max-time="{ hours: 21, minutes: 0 }"
                                            minutes-increment="30"
                                            no-minutes-overlay
                                            time-picker
                                        >
                                            <template #input-icon>
                                                <div style="margin-left: 12px">
                                                    <i class="far fa-clock"></i>
                                                </div>
                                            </template>
                                        </VueDatePicker>
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td>
                            <div class="d-flex justify-content-center">
                                <select v-model="dias_especialidad[5]" class="form-select" @change="cambiar_especialidad">
                                    <option 
                                        v-for="item in especialidades" 
                                        :key="item.id_especialidad"
                                        :value="item.id_especialidad"
                                    >
                                        {{item.descripcion}}
                                    </option>
                                </select>
                            </div>
                        </td>
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
import 'bootstrap';

import { mapGetters} from 'vuex'
import authApi from '@/api/authApi'

import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { ref } from 'vue';
import addDays from 'date-fns/addDays';
import Swal  from 'sweetalert2'

export default {
    components: {
        VueDatePicker
    },

    data() {
        return {
            msg: '',

            fecha_inicio: null,
            fecha_fin: null,
            dias_semana: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
            marcadores: [],
            dias_desactivados: [],
            fecha_maxima_registro: addDays(new Date(), 120),

            dias_consulta: [false,false,false,false,false,false],
            especialidades: null,
            dias_especialidad: [1,1,1,1,1,1],
            turno_dia: [[null, null], //Position 0: Inicio; 1:Fin
                        [null, null],
                        [null, null],
                        [null, null],
                        [null, null],
                        [null, null]],

            turno_tarde: [[null, null], //Position 0: Inicio; 1:Fin
                          [null, null],
                          [null, null],
                          [null, null],
                          [null, null],
                          [null, null]],

            datepicker: ref(null)
        }
    },

    async created(){
        document.title = 'Gestionar Horario'
        await this.validar_id()
        await this.obtener_nombre_profesional()
        //this.listaHoras(new Date(2023, 3-1, 24), new Date(2023, 4-1, 20), 9, 0, 11, 30, 1)
    },

    async mounted(){
        await this.obtener_especialidades();
        await this.obtener_feriados();

        $(document).ready(function(){
            $('#tabla').dataTable({
                responsive: true,
                destroy: true,
                language: {
                    url: "//cdn.datatables.net/plug-ins/1.10.11/i18n/Spanish.json",
                    emptyTable: "No hay datos que mostrar"
                },
                fixedColumns: true,
                pageLength: 6,
                lengthChange: false,
                searching: true,
                searchDelay: 0,
                ordering: false,
                dom: 'lrt',
                columns:[
                    {"className": "dt-center", "targets": "_all", orderable: false,},
                    {"className": "dt-center", "targets": "_all", orderable: false,},
                    {"className": "dt-center", "targets": "_all", orderable: false,},
                    {"className": "dt-center", "targets": "_all", orderable: false,},
                    {"className": "dt-center", "targets": "_all", "width": "20%", orderable: false,}
                ]
            }).api();
        })
    },

    computed:{
        ...mapGetters('auth', ['accessToken']),
        ...mapGetters('auth', ['role']),
    },

    methods: {
        regresar_atras(){
            const id_prof = this.$route.params.id_profesional
            if(this.role === 1){
                this.$router.push({name: 'agenda-profesional', params: {id_profesional: id_prof}})
            } else {
                this.$router.push({name: 'agenda-profesional-prof', params: {id_profesional: id_prof}})
            }
        },
        
        async registro_agenda(){
            const id_agenda = await this.registro_fechas();
            let resp1, resp2;

            for (let j = 0 ; j < this.dias_consulta.length ; j++) {
                if(this.dias_consulta[j]){

                    if(this.turno_dia[j][0] !== null){
                        resp1 = await this.registro_dias_turno(id_agenda,
                                                 j+1,
                                                 this.dias_especialidad[j],
                                                 1,
                                                 this.turno_dia[j][0].hours + ':' + this.turno_dia[j][0].minutes,
                                                 this.turno_dia[j][1].hours + ':' + this.turno_dia[j][1].minutes)
                        if(resp1 === 0) {
                            console.log('ERROR');
                            break;
                        }
                    }

                    if(this.turno_tarde[j][0] !== null){
                        resp2 = await this.registro_dias_turno(id_agenda,
                                                 j+1,
                                                 this.dias_especialidad[j],
                                                 2,
                                                 this.turno_tarde[j][0].hours + ':' + this.turno_tarde[j][0].minutes,
                                                 this.turno_tarde[j][1].hours + ':' + this.turno_tarde[j][1].minutes)
                        if(resp2 === 0) {
                            console.log('ERROR');
                            break;
                        }
                    }
                }
            }

            if(resp1 !== 0 & resp2 !== 0) {
                Swal.fire({
                html: '<h4>Se ha registrado correctamente la nueva agenda</h4>',
                icon: 'success'})
                .then(() => {
                    const id_prof = this.$route.params.id_profesional
                    if(this.role === 1){
                        this.$router.push({name: 'agenda-profesional', params: {id_profesional: id_prof}})
                    } else {
                        this.$router.push({name: 'agenda-profesional-prof', params: {id_profesional: id_prof}})
                    }
                })
            }

        },

        async registro_fechas(){
            authApi.defaults.headers.common['Authorization'] = `Bearer ${this.accessToken}`

            let obj = {}
            obj.id_profesional = this.$route.params.id_profesional
            obj.fecha_desde = this.fecha_inicio.toLocaleDateString('es-PY')
            obj.fecha_hasta = this.fecha_fin.toLocaleDateString('es-PY')

            try {
                const {data} = await authApi.post(`/profesionales/agenda`, obj)
                return data

            } catch (error) {
                return null
            }
        },

        async registro_dias_turno(id_agenda, id_dia, id_esp, id_tur, ini, fin){
            authApi.defaults.headers.common['Authorization'] = `Bearer ${this.accessToken}`

            let obj = {}
            obj.id_agenda = id_agenda
            obj.id_dia = id_dia
            obj.id_especialidad = id_esp
            obj.id_turno = id_tur
            obj.hora_inicio = ini
            obj.hora_fin = fin

            try {
                const {data} = await authApi.post(`/profesionales/agenda/dias`, obj)
                return data

            } catch (error) {
                return null
            }
        },

        async validar_id(){
            const id = this.$route.params.id_profesional
            const {data} = await authApi.get(`/profesionales/validar/${id}`, {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })

            if(data.length === 0){
                Swal.fire({
                html: '<h4>No existe el profesional seleccionado</h4>',
                icon: 'error',
                backdrop: `rgba(128,128,128,1)`
                }).then(() => {
                    this.$router.push({ path: '/' });
                })
            }
        },

        formato_fecha (date) {

            const day = date.getDate();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();

            return `${day}/${month}/${year}`;
        },

        validar() {
            let count = 0;
            let count_true = 0;

            if(!this.fecha_inicio || !this.fecha_fin){
                Swal.fire({
                html: '<h4>Se debe ingresar el rango de fecha</h4>',
                icon: 'error'});
            } else {
                if(this.fecha_fin <= this.fecha_inicio) {
                    Swal.fire({
                    html: '<h4>La fecha de finalización no debe ser menor o igual a la fecha de inicio</h4>',
                    icon: 'error'});
                } else {
                    if(this.dias_consulta.every(v => v === false)) {
                        Swal.fire({
                        html: '<h4>Se debe definir por lo menos un día para la consulta</h4>',
                        icon: 'error'});
                    } else {
                        for (let j = 0 ; j < this.dias_consulta.length ; j++) {
                            if(this.dias_consulta[j] === true) {
                                count_true ++;

                                if(!this.turno_dia[j][0] && !this.turno_dia[j][1] && !this.turno_tarde[j][1] && !this.turno_tarde[j][1]) {
                                    Swal.fire({
                                    html: '<h4>Se debe seleccionar el horario de por lo menos un turno</h4>',
                                    icon: 'error'});

                                    break;
                                } else {
                                    if ((this.turno_dia[j][0] && this.turno_dia[j][1] && !this.turno_tarde[j][0] && !this.turno_tarde[j][1]) || 
                                        (!this.turno_dia[j][0] && !this.turno_dia[j][1] && this.turno_tarde[j][0] && this.turno_tarde[j][1]) || 
                                        (this.turno_dia[j][0] && this.turno_dia[j][1] && this.turno_tarde[j][0] && this.turno_tarde[j][1])){
                                        
                                        let check1, check2;

                                        if(this.turno_dia[j][0] && this.turno_dia[j][1]) {
                                            check1 = this.check_hora(this.turno_dia[j][0], this.turno_dia[j][1])

                                            if(!check1) {
                                                Swal.fire({
                                                html: '<h4>La hora de finalización del turno no debe ser menor o igual a la hora de inicio</h4>',
                                                icon: 'error'});

                                                break;
                                            }
                                        } else {
                                            check1 = true
                                        }

                                        if(this.turno_tarde[j][0] && this.turno_tarde[j][1]) {
                                            check2 = this.check_hora(this.turno_tarde[j][0], this.turno_tarde[j][1])

                                            if(!check2) {
                                                Swal.fire({
                                                html: '<h4>La hora de finalización del turno no debe ser menor o igual a la hora de inicio</h4>',
                                                icon: 'error'});

                                                break;
                                            }
                                        } else {
                                            check2 = true
                                        }

                                        if(check1 === check2 === true){
                                            count ++;
                                        }
                                            
                                    } else {
                                        Swal.fire({
                                        html: '<h4>Se debe seleccionar la hora de inicio y fin del turno elegido</h4>',
                                        icon: 'error'});

                                        break;
                                    }
                                }
                            }
                        }

                        if(count === count_true){
                            this.registro_agenda();
                        }
                    }
                }
            }
        },

        cerrar_hora(){
            if (this.$refs.datepicker) {
                this.$refs.datepicker.closeMenu()
            }
        },

        check_hora(inicio, fin){
            let i = new Date(2000,1,1, inicio.hours, inicio.minutes, inicio.seconds)
            let f = new Date(2000,1,1, fin.hours, fin.minutes, fin.seconds)
            
            return f > i ? true : false
        },

        async obtener_especialidades(){
            const {data} = await authApi.get('/obtener_especialidades', {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })

            this.especialidades = data
        },

        async obtener_feriados(){
            const {data} = await authApi.get('/obtener_feriados', {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })

            for (let j = 0 ; j < data.length ; j++) {
                let obj =  {};
                obj.date = new Date(data[j].anho,data[j].mes-1,data[j].dia);
                obj.type = 'line';
                obj.tooltip = [{ text: data[j].motivo }]
                
                this.dias_desactivados.push(obj.date);
                this.marcadores.push(obj);
            }
        },

        async obtener_nombre_profesional(){
            const {data} = await authApi.get('/obtener_nombre_profesional?id_profesional=' + this.$route.params.id_profesional, {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })

            this.msg = 'Cargando información...'
            let nombre;

            if(!data){
                this.msg = 'No se puede obtener los datos del profesional :('

            } else {
                nombre = data.profesional.split(' ').filter((item) => item.length !== 0).join(' ')
                this.msg = 'Nuevas fechas de consultas para ' + nombre
            }
        },

        listaHoras(fecha_inicio, fecha_fin, h_i, m_i, h_f, m_f, dia) {
            let arrHoras = [];
            let horaActual = fecha_inicio;

            while (horaActual <= fecha_fin) {  new Date(2023, 3-1, 24)
                let v1 = new Date(horaActual.getFullYear(), horaActual.getMonth(), horaActual.getDate(), h_i, m_i);
                let v2 = new Date(horaActual.getFullYear(), horaActual.getMonth(), horaActual.getDate(), h_f, m_f);

                if(horaActual.getDay() === dia){
                    if(horaActual >= v1 && horaActual <= v2){
                        arrHoras.push(horaActual);
                    }
                }
                
                horaActual = this.sumarMinutos(horaActual, 30);
            }

            //console.log(arrHoras);
        },

        sumarMinutos(hora, minutos) {
            let nuevaHora = new Date();
            nuevaHora.setTime(hora.getTime() + minutos * 60000);
            return nuevaHora;
        }
    }
}
</script>


<style scoped>
    .form-switch .form-check-input {
        height: 24px;
        width: 48px;
    }

    input[type="checkbox"]:focus{
        box-shadow: none;
    }

    input[type="checkbox"]:checked{
        background-color: #198754;
        border: none;
    }

    input[type="checkbox"]:not(:checked){
        background-color: gray;
        border: none;
    }

    .form-switch .form-check-input {
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='3' fill='white'/%3e%3c/svg%3e");
    }

    select{
        border:1px solid black;
        margin-right: 10px;
        text-align: center;
        width: 350px;
    }

    select:focus {
        box-shadow: none;
        border:1px solid black;
    }

    table {
        text-align: center;
        width:100%;
    }
</style>



