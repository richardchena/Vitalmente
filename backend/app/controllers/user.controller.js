const db = require('../models');
const bcrypt = require('bcrypt');
const generator = require('generate-password');
const mail = require("../config/mailer");

//const Users = db.Users;

//Obtener el usuario por su identificador
exports.findByUsername = async (username) => {
    const query = `SELECT * FROM USERS WHERE LOWER(USERNAME) = LOWER('${username}')`

    try {
        const usuario = await db.sequelize.query(query);
        return usuario[0][0];

    } catch (error) {
        return null;
    }
};

// Registrar paciente en la base de datos
async function registrar_paciente (paciente) {
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

    // Encriptamos la contraseña
    const generacion_pass = generar_pass()
    const pass = await encriptar_pass(generacion_pass);

    //QUERY
    const query = `SELECT REGISTRAR_PACIENTE('${paciente.username}',
                                             '${paciente.email}',
                                             '${pass}',
                                             '${paciente.telf_numb}',
                                             ${paciente.role},
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
                                             '${paciente.ocu}',
                                             '${paciente.direccion}',
                                              ${paciente.lugar_residencia},
                                              ${paciente.tipo_doc})`

    try {
        let resp = await db.sequelize.query(query);
        resp = resp[0][0].registrar_paciente;

        resp = resp.replace('(', '');
        resp = resp.replace(')', '');
        
        const array = resp.split(',')

        if(array[0] === '0'){
            const msg = await enviar_pass(paciente.email, paciente.username, generacion_pass)
        }

        return {"message": array[1].replace('"', '').replace('"', ''), "codigo": array[0]};

    } catch (error) {
        return error;
    }
}

async function encriptar_pass (pass) {
    return await bcrypt.hash(pass, 10);
}


exports.crear_paciente = async (req, res) => {
    const resp = await registrar_paciente(req.body.params);
    res.json(resp);
};

exports.obtener_datos_usuario = async (req, res) => {
    const query = `SELECT DATOS_USUARIO('${req.query.username}')`

    try {
        const datos = await db.sequelize.query(query);
        const resultado = datos[0][0].datos_usuario.replace('(', '').replace(')', '').replace(/"/gi, "");
        const array = resultado.split(',');

        const obj = {
            email: array[0],
            nombre: array[1],
            rol: array[2],
            ocupacion: array[3]
        }

        return res.json(obj);

    } catch (error) {
        return res.send(null);
    }
};

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
            <p>Estimad@ paciente,
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

//ELIMINAR USUARIO
exports.eliminar_paciente = async (req, res) => {
    const resp = await eliminar_paciente_bd(req.params.username);
    res.json(resp);
};

async function eliminar_paciente_bd(user) {
    const query = `SELECT ELIMINAR_PACIENTE('${user}')`
    try {
        const datos = await db.sequelize.query(query);
        return datos[0][0].eliminar_paciente

    } catch (error) {
        return error;
    }
}

//Lista Paciente
async function lista_pacientes_bd() {
    const query = 'SELECT * FROM LISTA_PACIENTES ORDER BY ID DESC'
    try {
        const datos = await db.sequelize.query(query);
        return datos[0]

    } catch (error) {
        return error;
    }
}

exports.lista_pacientes = async (req, res) => {
    const resp = await lista_pacientes_bd();
    res.json(resp);
};

//Cambiar estado
async function cambiar_estado_paciente_bd(id_paciente) {
    const query = `SELECT CAMBIAR_STATUS_PACIENTE(${id_paciente})`
    try {
        const datos = await db.sequelize.query(query);
        return datos[0][0].CAMBIAR_STATUS_PACIENTE

    } catch (error) {
        return error;
    }
}

exports.cambiar_estado_paciente = async (req, res) => {
    const resp = await cambiar_estado_paciente_bd(req.params.id_paciente);
    res.json(resp);
};


//Dar de baja paciente
async function baja_paciente_bd(id_paciente) {
    const query = `SELECT ELIMINAR_PACIENTE(${id_paciente})`
    try {
        const datos = await db.sequelize.query(query);
        return datos[0][0].CAMBIAR_STATUS_PACIENTE

    } catch (error) {
        return error;
    }
}

exports.baja_paciente = async (req, res) => {
    const resp = await baja_paciente_bd(req.params.id_paciente);
    res.json(resp);
};

exports.obtener_datos_para_modificar = async (req, res) => {
    const query = `SELECT * FROM GET_DATOS_PACIENTE_MODIFICAR WHERE ID_PACIENTE = ${req.query.id_paciente}`
    try {
        const datos = await db.sequelize.query(query);
        res.json(datos[0][0])

    } catch (error) {
        res.json(error);
    }
};


exports.modificar_paciente = async (req, res) => {
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
    const query = `SELECT MODIFICAR_PACIENTE(${paciente.id_paciente},
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
                                             '${paciente.ocu}',
                                             '${paciente.direccion}',
                                              ${paciente.lugar_residencia},
                                              ${paciente.tipo_doc})`

    try {
        const resp = await db.sequelize.query(query);
        res.json(resp[0][0].modificar_paciente);

    } catch (error) {
        return res.json(error);
    }
}; 

exports.consulta_datos_paciente = async (req, res) => {
    const cod = req.query.id_paciente
    const query = `SELECT * FROM HISTORIAL_PACIENTE_DATOS_PACIENTE WHERE ID_PACIENTE =  ${cod}`

    try {
        const datos = await db.sequelize.query(query);
        res.json(datos[0][0]);

    } catch (error) {
        return null;
    }
}


exports.obtener_id_paciente = async (req, res) => {
    const usr = req.query.username
    const query = `SELECT A.ID_PACIENTE 
                   FROM PACIENTES A
                   INNER JOIN USERS B ON B.ID = A.ID_USUARIO
                   WHERE LOWER(B.USERNAME) = LOWER('${usr}')`

    try {
        const datos = await db.sequelize.query(query);
        res.json(datos[0][0]);

    } catch (error) {
        res.json(error);
    }
}

exports.change_password = async (req, res) => {
    const usr = req.body.username
    const p_a = req.body.pass_actual
    const p_n = req.body.pass_new
    const p_v = req.body.pass_new_verif

    if(p_n !== p_v){
        res.json({cod: 1, msg: "Las contraseñas no coinciden"})
        return
    }

    if(p_n.length < 8) {
        res.json({cod: 1, msg: "La nueva contraseña debe contener al menos 8 caracteres"})
        return    
    }

    if(p_a === p_n){
        res.json({cod: 1, msg: "La nueva contraseña debe ser distinta a la anterior"})
        return
    }

    const p_bd = await password_actual(usr)
    const isMatch = await bcrypt.compare(p_a, p_bd);

    if(!isMatch){
        res.json({cod: 1, msg: "Contraseña incorrecta"})
    } else {
        const encriptado = await encriptar_pass(p_n);
        const resp = await cambiar_pass_bd(usr, encriptado)
        if(resp === 0) {
            res.json({cod: 0, msg: "Contraseña actualizada correctamente" })
        } else {
            res.json({cod: 1, msg: "Hubo un error al actualizar. Inténtelo más tarde" })
        }
        
    }
}

async function password_actual(username){
    const query = `SELECT PASSWORD FROM USERS WHERE USERNAME = '${username}'`

    try {
        const datos = await db.sequelize.query(query);
        return datos[0][0].password;

    } catch (error) {
        return null;
    }
}

async function cambiar_pass_bd(user, pass) {
    const query = `UPDATE USERS
                   SET PASSWORD = '${pass}'
                   WHERE USERNAME = '${user}'`

    try {
        await db.sequelize.query(query);
        return 0;

    } catch (error) {
        return null;
    }
}