const db = require('../models');
const bcrypt = require('bcrypt');
const mail = require("../config/mailer");
const generator = require('generate-password');

//Lista Profesionales
exports.lista_profesionales = async (req, res) => {
    const query = 'SELECT * FROM LISTA_PROFESIONALES ORDER BY ID DESC'
    try {
        const datos = await db.sequelize.query(query);
        res.json(datos[0])

    } catch (error) {
        res.json(error);
    }
};

//Cambiar estado
exports.cambiar_estado_profesional = async (req, res) => {
    const query = `SELECT CAMBIAR_STATUS_PROFESIONAL(${req.params.id_paciente})`
    try {
        const datos = await db.sequelize.query(query);
        res.json(datos[0][0].CAMBIAR_STATUS_PROFESIONAL)

    } catch (error) {
        res.json(error);
    }
}

//Dar de baja profesional
exports.baja_profesional = async (req, res) => {
    const query = `SELECT ELIMINAR_PROFESIONAL(${req.params.id_paciente})`
    try {
        await db.sequelize.query(query);
        res.json({"message": "Se ha eliminado correctamente el usuario"})

    } catch (error) {
        res.json(error);
    }
}

//Dar de alta profesional
exports.registrar_profesional = async (req, res) => {
    const profesional = req.body;

    // VERIFICAMOS LOS POSIBLES NULOS (STRING)
    const seg_nombre = profesional.seg_nombre ? "'" + profesional.seg_nombre + "'" : 'NULL';
    const ter_nombre = profesional.ter_nombre ? "'" + profesional.ter_nombre + "'" : 'NULL';
    const seg_apellido = profesional.seg_apellido ? "'" + profesional.seg_apellido + "'" : 'NULL';

    let lugar;

    if(profesional.lugar_nac === undefined){
        lugar = 'NULL';
    } else {
        lugar = profesional.lugar_nac;
    }

    // Encriptamos la contraseña
    const generacion_pass = generar_pass()
    const pass = await bcrypt.hash(generacion_pass, 10);

    //QUERY
    const query = `SELECT REGISTRAR_PROFESIONAL('${profesional.username}',
                                             '${profesional.email}',
                                             '${pass}',
                                             '${profesional.telf_numb}',
                                             ${profesional.role},
                                             '${profesional.pri_nombre}',
                                             ${seg_nombre},
                                             ${ter_nombre},
                                             '${profesional.pri_apellido}',
                                             ${seg_apellido},
                                             '${profesional.fec_nac}',
                                             ${profesional.nac},
                                             ${lugar},
                                             '${profesional.estado_civ}',
                                             '${profesional.genero}',
                                             '${profesional.nro_doc}',
                                             '${profesional.reg}',
                                             '${profesional.direccion}',
                                              ${profesional.lugar_residencia},
                                              ${profesional.tipo_doc})`

    try {
        let resp = await db.sequelize.query(query);
        resp = resp[0][0].registrar_profesional;

        resp = resp.replace('(', '');
        resp = resp.replace(')', '');
        
        const array = resp.split(',')

        if(array[0] === '0'){
            const msg = await enviar_pass(profesional.email, profesional.username, generacion_pass)
        }

        res.json({"message": array[1].replace('"', '').replace('"', ''), "codigo": array[0]});

    } catch (error) {
        res.json(error);
    }
}


//OTROS
function generar_pass(){
    const password_generado = generator.generate({
        length: 8,
        numbers: true
    });

    return password_generado
}

async function enviar_pass(email, user, pass) {
    let msg;
    await mail.transporter.sendMail({
        from: '"noreply" tparqweb@gmail.com>',
        to: email,
        subject: "Le damos la bienvenida a la Clínica VitalMente :D",
        html: `
            <p>Estimad@ profesional,
            <p>Le informamos que se ha creado su cuenta</p>
            <p>Usuario: ${user}</p>
            <p>Contraseña: ${pass}</p>

            <br>
            <strong><p>Una vez recibido este mensaje favor eliminarlo</p></strong>
            <p>Saludos cordiales</p>
            <p>Atte. Clínica VitalMente</p>
        `,
    })
    .then(data => {
        msg = "Mail enviado correctamente"
    })
    .catch(err => {
        msg = "Error inesperado"
    });

    return msg
}

// Get de los datos a modificar
exports.obtener_datos_para_modificar = async (req, res) => {
    const query = `SELECT * FROM GET_DATOS_PROFESIONAL_MODIFICAR WHERE ID_PROFESIONAL = ${req.query.id_paciente	}`
    try {
        const datos = await db.sequelize.query(query);
        res.json(datos[0][0])

    } catch (error) {
        res.json(error);
    }
};

//Modificar datos del profesional
exports.modificar_profesional = async (req, res) => {
    const paciente = req.body;

    // VERIFICAMOS LOS POSIBLES NULOS (STRING)
    const seg_nombre = paciente.seg_nombre ? "'" + paciente.seg_nombre + "'" : 'NULL';
    const ter_nombre = paciente.ter_nombre ? "'" + paciente.ter_nombre + "'" : 'NULL';
    const seg_apellido = paciente.seg_apellido ? "'" + paciente.seg_apellido + "'" : 'NULL';

    let lugar;

    if(paciente.lugar_nac === undefined){
        lugar = 'NULL';
    } else {
        lugar = paciente.lugar_nac;
    }

    //QUERY
    const query = `SELECT MODIFICAR_PROFESIONAL(${paciente.id_paciente},
                                             '${paciente.email}',
                                             '${paciente.telf_numb}',
                                             '${paciente.pri_nombre}',
                                             ${seg_nombre},
                                             ${ter_nombre},
                                             '${paciente.pri_apellido}',
                                             ${seg_apellido},
                                             '${paciente.fec_nac}',
                                             ${paciente.nac},
                                             ${lugar},
                                             '${paciente.estado_civ}',
                                             '${paciente.genero}',
                                             '${paciente.nro_doc}',
                                             '${paciente.reg}',
                                             '${paciente.direccion}',
                                              ${paciente.lugar_residencia},
                                              ${paciente.tipo_doc})`

    try {
        const resp = await db.sequelize.query(query);
        res.json(resp[0][0].modificar_profesional);

    } catch (error) {
        return res.json(error);
    }
}; 


exports.registrar_agenda = async (req, res) => {
    const d = req.body;

    const query = `SELECT REGISTRAR_AGENDA_CONSULTA(${d.id_profesional}, '${d.fecha_desde}', '${d.fecha_hasta}');`
    try {
        const datos = await db.sequelize.query(query);
        res.json(datos[0][0].registrar_agenda_consulta)

    } catch (error) {
        res.json(error);
    }
};

exports.registrar_dias_consulta = async (req, res) => {
    const d = req.body;

    const query = `SELECT REGISTRAR_DIAS_CONSULTA(${d.id_agenda}, ${d.id_dia}, ${d.id_especialidad}, ${d.id_turno}, '${d.hora_inicio}', '${d.hora_fin}');`
    try {
        const datos = await db.sequelize.query(query);
        res.json(datos[0][0].registrar_dias_consulta)

    } catch (error) {
        res.json(error);
    }
};

exports.validar_id = async (req, res) => {
    const id = req.params.id_profesional;

    const query = `select * from profesionales where id_profesional = ${id}`
    try {
        const datos = await db.sequelize.query(query);
        res.json(datos[0])

    } catch (error) {
        res.json(error);
    }
};

exports.lista_agenda = async (req, res) => {
    const id = req.query.id_profesional;

    const query = `SELECT * FROM AGENDAS_PROFESIONALES WHERE ID_PROFESIONAL = ${id} ORDER BY ORDEN DESC`
    try {
        const datos = await db.sequelize.query(query);
        res.json(datos[0])

    } catch (error) {
        res.json(error);
    }
};

exports.dias = async (req, res) => {
    const id = req.query.id_agenda;

    const query = `SELECT * FROM DIAS_CONSULTA_PROFESIONAL WHERE ID_AGENDA = ${id}`
    try {
        const datos = await db.sequelize.query(query);
        res.json(datos[0])

    } catch (error) {
        res.json(error);
    }
};

exports.obtener_id_profesional = async (req, res) => {
    const usr = req.query.username
    const query = `SELECT A.ID_PROFESIONAL 
                   FROM PROFESIONALES A
                   INNER JOIN USERS B ON B.ID = A.ID_USUARIO
                   WHERE LOWER(B.USERNAME) = LOWER('${usr}')`

    try {
        const datos = await db.sequelize.query(query);
        res.json(datos[0][0]);

    } catch (error) {
        res.json(error);
    }
}