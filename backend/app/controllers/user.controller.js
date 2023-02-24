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

    // Encriptamos la contraseña
    const generacion_pass = generar_pass()
    const pass = await encriptar_pass(generacion_pass);

    //QUERY
    const query = `SELECT REGISTRAR_PACIENTE('${paciente.username}',
                                             '${paciente.email}',
                                             '${pass}',
                                             ${paciente.role},
                                             '${paciente.pri_nombre}',
                                             ${seg_nombre},
                                             ${ter_nombre},
                                             '${paciente.pri_apellido}',
                                             ${seg_apellido},
                                             '${paciente.fec_nac}',
                                             ${paciente.nac},
                                             ${paciente.lugar_nac || 'NULL'},
                                             '${paciente.estado_civ}',
                                             '${paciente.genero}',
                                             '${paciente.nro_doc}',
                                             '${paciente.ocu}')`

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