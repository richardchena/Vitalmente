const db = require('../models');

exports.obtener_paises = async (req, res) => {
    const query = `SELECT ID_PAIS, NOMBRE FROM PAISES ORDER BY NOMBRE`

    try {
        const paises = await db.sequelize.query(query);
        res.json(paises[0]);

    } catch (error) {
        return null;
    }
};

exports.obtener_departamento = async (req, res) => {
    const query = `SELECT ID_DEPARTAMENTO, DESCRIPCION FROM DEPARTAMENTOS ORDER BY DESCRIPCION`

    try {
        const deps = await db.sequelize.query(query);
        res.json(deps[0]);

    } catch (error) {
        return null;
    }
};

exports.obtener_ciudades = async (req, res) => {
    const cod = req.query.cod
    const query = `SELECT COD_CONCATENADO, DESCRIPCION FROM CIUDADES WHERE ID_DEPARTAMENTO = ${cod} ORDER BY DESCRIPCION`

    try {
        const ciudades = await db.sequelize.query(query);
        res.json(ciudades[0]);

    } catch (error) {
        return null;
    }
};

exports.obtener_especialidades = async (req, res) => {
    //const query = `SELECT ID_ESPECIALIDAD, DESCRIPCION FROM ESPECIALIDADES ORDER BY DESCRIPCION`
    const query = `SELECT * FROM ESPECIALIDADES ORDER BY ID_ESPECIALIDAD`

    try {
        const especialidades = await db.sequelize.query(query);
        res.json(especialidades[0]);

    } catch (error) {
        return null;
    }
};

exports.obtener_feriados = async (req, res) => {
    const query = `SELECT * FROM FERIADOS`

    try {
        const feriados = await db.sequelize.query(query);
        res.json(feriados[0]);

    } catch (error) {
        res.json(error);
    }
};

exports.obtener_tipo_documento = async (req, res) => {
    const query = `SELECT * FROM TIPOS_DOCUMENTO;`

    try {
        const datos = await db.sequelize.query(query);
        res.json(datos[0]);

    } catch (error) {
        res.json(error);
    }
};

exports.obtener_correo = async (req, res) => {
    /*const query = `SELECT EMAIL
                   FROM USERS
                   WHERE LOWER(USERNAME) = LOWER('${req.query.username}')`*/

    const query = `SELECT U.EMAIL
    FROM CITAS C
    INNER JOIN PACIENTES P ON P.ID_PACIENTE = C.ID_PACIENTE
    INNER JOIN USERS U ON U.ID = P.ID_USUARIO
    WHERE C.ID_CITA = ${+req.query.id_cita}`

    try {
        const datos = await db.sequelize.query(query);
        res.json(datos[0][0].email);

    } catch (error) {
        res.json(error);
    }
};

exports.page404 = (req, res) => {
    res.redirect('https://www.clinicavitalmente.com')
};