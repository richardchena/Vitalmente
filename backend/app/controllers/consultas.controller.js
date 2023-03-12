const db = require('../models');

exports.registrar_consulta = async (req, res) => {
    const consulta = req.body;

    // VERIFICAMOS LOS POSIBLES NULOS (STRING)
    const tecnica = consulta.tecnica ? "'" + consulta.tecnica + "'" : 'NULL';
    const antecedente = consulta.antecedente ? "'" + consulta.antecedente + "'" : 'NULL';

    //QUERY
    const query = `SELECT REGISTRAR_CONSULTA(${consulta.id_paciente},
                                             ${consulta.id_profesional},
                                             ${consulta.id_especialidad},
                                             '${consulta.motivo}',
                                             ${antecedente},
                                             '${consulta.diagnostico}',
                                             ${tecnica})`

    try {
        let resp = await db.sequelize.query(query);
        resp = resp[0][0].registrar_consulta;

        resp = resp.replace('(', '');
        resp = resp.replace(')', '');
        
        const array = resp.split(',')

        res.json({"message": array[1].replace('"', '').replace('"', ''), "codigo": array[0]});

    } catch (error) {
        res.json(error);
    }
}

exports.obtener_historial = async (req, res) => {
    const cod = req.query.id_paciente
    const query = `SELECT * FROM CONSULTAS_PACIENTE WHERE ID_PACIENTE = ${cod}`

    try {
        const datos = await db.sequelize.query(query);
        res.json(datos[0]);

    } catch (error) {
        return null;
    }
};