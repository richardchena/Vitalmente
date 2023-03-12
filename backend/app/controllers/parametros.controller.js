const db = require('../models');

exports.obtener_paises = async (req, res) => {
    const query = `SELECT ID_PAIS, NOMBRE FROM PAISES`

    try {
        const paises = await db.sequelize.query(query);
        res.json(paises[0]);

    } catch (error) {
        return null;
    }
};

exports.obtener_departamento = async (req, res) => {
    const query = `SELECT ID_DEPARTAMENTO, DESCRIPCION FROM DEPARTAMENTOS`

    try {
        const deps = await db.sequelize.query(query);
        res.json(deps[0]);

    } catch (error) {
        return null;
    }
};

exports.obtener_ciudades = async (req, res) => {
    const cod = req.query.cod
    const query = `SELECT COD_CONCATENADO, DESCRIPCION FROM CIUDADES WHERE ID_DEPARTAMENTO = ${cod}`

    try {
        const ciudades = await db.sequelize.query(query);
        res.json(ciudades[0]);

    } catch (error) {
        return null;
    }
};

exports.obtener_especialidades = async (req, res) => {
    const query = `SELECT ID_ESPECIALIDAD, DESCRIPCION FROM ESPECIALIDADES`

    try {
        const especialidades = await db.sequelize.query(query);
        res.json(especialidades[0]);

    } catch (error) {
        return null;
    }
};