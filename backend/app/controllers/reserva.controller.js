const db = require('../models');

async function obtener_bd(params){
    const id_pro = +params.id_profesional || 0
    const id_tur = +params.id_turno || 0
    const id_esp = +params.id_especialidad || 0

    let t_pro, t_tur, t_esp;
    
    if (id_pro === 0) {
        t_pro = id_pro

    } else {
        t_pro = 'id_profesional' 
    }

    if (id_tur === 0) {
        t_tur = id_tur

    } else {
        t_tur = 'id_turno' 
    }

    if (id_esp === 0) {
        t_esp = id_esp

    } else {
        t_esp = 'id_especialidad' 
    }

    const query =  `SELECT * 
                    FROM LISTA_FECHAS_DISPONIBLES
                    WHERE ${t_pro} = ${id_pro} AND ${t_tur} = ${id_tur} AND ${t_esp} = ${id_esp}
                    ORDER BY ID_AGENDA, ID_DIA, HORA_INICIO`

    try {
        const datos = await db.sequelize.query(query);
        return datos[0];

    } catch (error) {
        return null;
    }
}

async function obtener_citas_registradas () {
    const query = `SELECT 
                    ID_CITA,
                    ID_PACIENTE,
                    ID_PROFESIONAL,
                    ESTADO,
                    ID_TURNO,
                    ID_ESPECIALIDAD,
                    FECHA,
                    HORA 
                   FROM CITAS 
                   WHERE ESTADO IN (1) AND FECHA > CURRENT_DATE
                   ORDER BY ID_CITA`

    try {
        return (await db.sequelize.query(query))[0];
        //return datos[0];

    } catch (error) {
        return null;
    }

}

async function obtener_feriados () {
    const query = `SELECT * FROM FERIADOS`

    try {
        return (await db.sequelize.query(query))[0];

    } catch (error) {
        return null;
    }

}

exports.obtener_lista_disponible = async (req, res) => {
    const resp = await obtener_bd(req.query);
    const feriados = await obtener_feriados();
    const citas = await obtener_citas_registradas();
    let contenedor = [];

    for (let j = 0 ; j < resp.length ; j++) {
        let h_i = +resp[j].hora_inicio.substring(0, 2)
        let m_i = +resp[j].hora_inicio.substring(3, 5)

        let h_f = +resp[j].hora_fin.substring(0, 2)
        let m_f = +resp[j].hora_fin.substring(3, 5)
        
        let f1 = new Date(resp[j].fecha_desde)
        let f2 = new Date(resp[j].fecha_hasta)

        contenedor.push(listaHoras(f1, f2, h_i, m_i, h_f, m_f, +resp[j].id_dia))
    }

    let obj_final = [];
    let dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
    let turnos = ['No definido','Mañana', 'Tarde']

    for (let j = 0 ; j < resp.length ; j++) {
        for (let i = 0 ; i < contenedor[j].length ; i++) {
            let o1 = {}
            o1.dia = dias[contenedor[j][i].getDay()]
            o1.id_dia = contenedor[j][i].getDay()
            o1.turno = turnos[resp[j].id_turno]
            o1.id_turno = resp[j].id_turno
            o1.fecha = contenedor[j][i].toLocaleDateString('es-PY')
            o1.hora = contenedor[j][i].toLocaleTimeString('es-PY')
            o1.id_profesional = resp[j].id_profesional
            o1.profesional = resp[j].profesional.replace('  ', ' ')
            o1.id_especialidad = resp[j].id_especialidad
            o1.especialidad = resp[j].especialidad

            obj_final.push(o1)
        }
    }

    let indices_borrar = []

    for (let j = 0 ; j < citas.length ; j++) {
        for (let i = 0 ; i < obj_final.length ; i++) {
            let sp = citas[j].fecha.split('-');
            let mes = null;
            let dia = null;

            if(sp[1][0] === '0') {
                mes = sp[1][1]
            } else {
                mes = sp[1]
            }

            if(sp[2][0] === '0') {
                dia = sp[2][1]
            } else {
                dia = sp[2]
            }
        
            let fec_final =  dia + '/' + mes + '/' + sp[0]

                if(obj_final[i].fecha           === fec_final && 
                   obj_final[i].hora            === citas[j].hora && 
                   obj_final[i].id_especialidad === citas[j].id_especialidad && 
                   obj_final[i].id_profesional  === citas[j].id_profesional) {
                    
                    indices_borrar.push(i);
                }
        }
    }

    let obj_a_borrar = []

    for (let j = 0 ; j < indices_borrar.length ; j++) {
        obj_a_borrar.push(obj_final[indices_borrar[j]])
    }

    for (let j = 0 ; j < obj_a_borrar.length ; j++) {
        let index = obj_final.indexOf(obj_a_borrar[j]);
        obj_final.splice(index, 1);
    }

    const fecha_filtro = req.query.fecha
    let finalisimo = []

    //MOSTRAR SOLO FECHAS MAYOR A HOY
    let fechas_validas = []
    for (let j = 0 ; j < obj_final.length ; j++) {
        if(comparar_hoy(obj_final[j].fecha, obj_final[j].hora)){
            fechas_validas.push(obj_final[j])
        }
    }

    obj_final = null
    obj_final = fechas_validas
    //FIN FUNCION

    //FERIADOS
    obj_final = comparar_feriado(obj_final, feriados)

    if(fecha_filtro !== '0') {
        for (let j = 0 ; j < obj_final.length ; j++) {
            if(obj_final[j].fecha === fecha_filtro) {
                finalisimo.push(obj_final[j])
            }
        }
        res.send(finalisimo);
    } else {
        res.send(obj_final);
    }

}

function comparar_feriado(list_fec, list_feriados){
    let obj = []

    for (let j = 0 ; j < list_fec.length ; j++) {
        for (let i = 0 ; i < list_feriados.length ; i++) {
            let f = list_feriados[i].dia.toString() + '/' + list_feriados[i].mes.toString() + '/' + list_feriados[i].anho.toString()
            if(f === list_fec[j].fecha){
                obj.push(list_fec[j])
            }
        }
    }

    let unique = obj.filter((value, index, array) => obj.indexOf(value) === index);
    let final = list_fec

    for (let j = 0 ; j < unique.length ; j++) {
        let index = final.indexOf(unique[j]);
        final.splice(index, 1);
    }

    return final
}

function comparar_hoy(fecha, hora){
    let f = fecha.split('/')
    let h = hora.split(':')
    let hoy = new Date()
    fecha_param = new Date(f[2], f[1]-1, f[0], h[0], h[1], h[1])

    if(fecha_param > hoy) return true
    else false
}

exports.registrar_reserva = async (req, res) => {
    const c = req.body

    const query = `INSERT INTO CITAS (ID_PACIENTE, ID_PROFESIONAL, ID_TURNO, ID_ESPECIALIDAD, FECHA, HORA)
                   VALUES (${c.id_paciente}, ${c.id_profesional}, ${c.id_turno}, ${c.id_especialidad}, '${c.fecha}', '${c.hora}')`

    try {
        await db.sequelize.query(query);
        res.json({cod: 0, mensaje: 'Se ha registrado correctamente la reserva'});
            
    } catch (error) {
        res.json({cod: 1, mensaje: 'Hubo un error al registrar la cita', error});
    }
}

exports.distinct_reserva = async (req, res) => {
    const valor = req.query
    const id_pro = +valor.id_profesional || 0
    const id_tur = +valor.id_turno || 0
    const id_esp = +valor.id_especialidad || 0

    let t_pro, t_tur, t_esp;
    
    if (id_pro === 0) {
        t_pro = id_pro

    } else {
        t_pro = 'id_profesional' 
    }

    if (id_tur === 0) {
        t_tur = id_tur

    } else {
        t_tur = 'id_turno' 
    }

    if (id_esp === 0) {
        t_esp = id_esp

    } else {
        t_esp = 'id_especialidad' 
    }

    const query =  `SELECT DISTINCT ${valor.id}, ${valor.propiedad} 
                    FROM LISTA_FECHAS_DISPONIBLES
                    WHERE ${t_pro} = ${id_pro} AND ${t_tur} = ${id_tur} AND ${t_esp} = ${id_esp}
                    ORDER BY ${valor.id}`

    try {
        const datos = await db.sequelize.query(query);
        res.json(datos[0]);
            
    } catch (error) {
        res.json(datos[0]);
    }
}

//DISTICT FECHA
exports.distinct_fecha = async (req, res) => {
    const resp = await obtener_bd(req.query);
    const feriados = await obtener_feriados();
    const citas = await obtener_citas_registradas();
    let contenedor = [];

    for (let j = 0 ; j < resp.length ; j++) {
        let h_i = +resp[j].hora_inicio.substring(0, 2)
        let m_i = +resp[j].hora_inicio.substring(3, 5)

        let h_f = +resp[j].hora_fin.substring(0, 2)
        let m_f = +resp[j].hora_fin.substring(3, 5)
        
        let f1 = new Date(resp[j].fecha_desde)
        let f2 = new Date(resp[j].fecha_hasta)

        contenedor.push(listaHoras(f1, f2, h_i, m_i, h_f, m_f, +resp[j].id_dia))
    }

    let obj_final = [];
    let dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
    let meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviemnbre', 'Diciembre']
    let turnos = ['No definido','Mañana', 'Tarde']

    for (let j = 0 ; j < resp.length ; j++) {
        for (let i = 0 ; i < contenedor[j].length ; i++) {
            let o1 = {}
            o1.dia = dias[contenedor[j][i].getDay()]
            o1.id_dia = contenedor[j][i].getDay()
            o1.turno = turnos[resp[j].id_turno]
            o1.id_turno = resp[j].id_turno
            o1.fecha = contenedor[j][i].toLocaleDateString('es-PY')
            o1.hora = contenedor[j][i].toLocaleTimeString('es-PY')
            o1.id_profesional = resp[j].id_profesional
            o1.profesional = resp[j].profesional.replace('  ', ' ')
            o1.id_especialidad = resp[j].id_especialidad
            o1.especialidad = resp[j].especialidad

            obj_final.push(o1)
        }
    }

    //MOSTRAR SOLO FECHAS MAYOR A HOY
    let fechas_validas = []
    for (let j = 0 ; j < obj_final.length ; j++) {
        if(comparar_hoy(obj_final[j].fecha, obj_final[j].hora)){
            fechas_validas.push(obj_final[j])
        }
    }

    obj_final = null
    obj_final = fechas_validas
    //FIN FUNCION

    let indices_borrar = []

    for (let j = 0 ; j < citas.length ; j++) {
        for (let i = 0 ; i < obj_final.length ; i++) {
            let sp = citas[j].fecha.split('-');
            let mes = null;
            let dia = null;

            if(sp[1][0] === '0') {
                mes = sp[1][1]
            } else {
                mes = sp[1]
            }

            if(sp[2][0] === '0') {
                dia = sp[2][1]
            } else {
                dia = sp[2]
            }

            let fec_final = dia + '/' + mes + '/' + sp[0]

                if(obj_final[i].fecha           === fec_final && 
                obj_final[i].hora            === citas[j].hora && 
                obj_final[i].id_especialidad === citas[j].id_especialidad && 
                obj_final[i].id_profesional  === citas[j].id_profesional) {
                    
                    indices_borrar.push(j);
                }
        }
    }

    let obj_a_borrar = []

    for (let j = 0 ; j < indices_borrar.length ; j++) {
        obj_a_borrar.push(obj_final[indices_borrar[j]])
    }

    for (let j = 0 ; j < obj_a_borrar.length ; j++) {
        let index = obj_final.indexOf(obj_a_borrar[j]);
        obj_final.splice(index, 1);
    }

    //const fecha_filtro = req.query.fecha
    let finalisimo = []
    let a1 = obj_final.map(item => item.fecha).filter((value, index, self) => self.indexOf(value) === index)
    //res.send(a1)

    for (let j = 0 ; j < a1.length ; j++){
        let ob1_pruba = {}
        let fec_spli = a1[j].split('/')
        let clase = new Date(fec_spli[2], fec_spli[1]-1, fec_spli[0])

        ob1_pruba.fecha = a1[j]
        ob1_pruba.clase = clase
        ob1_pruba.desc = `${dias[clase.getDay()].toLowerCase()}, ${clase.getDate()} de ${meses[clase.getMonth()].toLowerCase()} del ${clase.getFullYear()}`
        
        finalisimo.push(ob1_pruba)
    }

    let ascSort = finalisimo.sort((obj1, obj2) =>
        obj1.clase - obj2.clase,
    );

    ascSort = await comparar_feriado2(ascSort, feriados)
    res.send(ascSort)
}

function comparar_feriado2(list_fec, list_feriados){
    let obj = []

    for (let j = 0 ; j < list_fec.length ; j++) {
        for (let i = 0 ; i < list_feriados.length ; i++) {
            let f = new Date(list_feriados[i].anho, list_feriados[i].mes - 1, list_feriados[i].dia )
            if(f.toLocaleDateString('es-PY') === list_fec[j].clase.toLocaleDateString('es-PY')){
                obj.push(list_fec[j])
            }
        }
    }

    let unique = obj.filter((value, index, array) => obj.indexOf(value) === index);

    let final = list_fec

    for (let j = 0 ; j < unique.length ; j++) {
        let index = final.indexOf(unique[j]);
        final.splice(index, 1);
    }

    return final
}

// Funciones de fechas y horas
function listaHoras(fecha_inicio, fecha_fin, h_i, m_i, h_f, m_f, dia) {
    let arrHoras = [];
    let horaActual = fecha_inicio;

    while (horaActual <= fecha_fin) { 
        let v1 = new Date(horaActual.getFullYear(), horaActual.getMonth(), horaActual.getDate(), h_i, m_i);
        let v2 = new Date(horaActual.getFullYear(), horaActual.getMonth(), horaActual.getDate(), h_f, m_f);

        if(horaActual.getDay() === dia){
            if(horaActual >= v1 && horaActual <= v2){
                arrHoras.push(horaActual);
            }
        }
        
        horaActual = sumarMinutos(horaActual, 30);
    }

    return arrHoras;
}

function sumarMinutos(hora, minutos) {
    let nuevaHora = new Date();
    nuevaHora.setTime(hora.getTime() + minutos * 60000);
    return nuevaHora;
}

//CITAS
exports.obtener_citas_agendadas = async (req, res) => {
    const cod = req.query.id_paciente
    const query = `SELECT * FROM LISTA_AGENDAS_PACIENTE WHERE ID_PACIENTE = ${cod}`

    try {
        const datos = await db.sequelize.query(query);
        res.json(datos[0]);

    } catch (error) {
        res.json(error);
    }
};

//CANCELAR CITA
exports.cancelar_cita_paciente = async (req, res) => {
    const cod = req.body.id_cita
    const query = `UPDATE CITAS SET ESTADO = 2 WHERE ID_CITA = ${cod}`

    try {
        await db.sequelize.query(query);
        res.json({cod: 0, msg: "Se ha cancelado correctamente"});

    } catch (error) {
        res.json({cod: 1, msg: "Hubo un error al modificar el registro. Intente más tarde"});
    }
};