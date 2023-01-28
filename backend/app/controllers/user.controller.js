const db = require('../models');
const bcrypt = require('bcrypt');

const Users = db.Users;

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
    const pass = await encriptar_pass(paciente.password);

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
                                             '${paciente.nro_doc}',
                                             '${paciente.ocu}')`

    try {
        let resp = await db.sequelize.query(query);
        resp = resp[0][0].registrar_paciente;

        resp = resp.replace('(', '');
        resp = resp.replace(')', '');
        
        const array = resp.split(',')

        return {"message": array[1], "codigo": array[0]};

    } catch (error) {
        return error;
    }
}

async function encriptar_pass (pass) {
    return await bcrypt.hash(pass, 10);
}


exports.crear_admin = async (req, res) => {
    const resp = await registrar_paciente(req.body);
    res.send(`<h1>${resp.message}</h1>`);
};