const db = require('../models');

// CITAS DEL DIA
exports.obtener_citas_agendadas = async (req, res) => {
    const query = `SELECT * FROM LISTA_RESERVAS_CITAS_DIA`
    try {
        const datos = await db.sequelize.query(query);
        res.json(datos[0]);

    } catch (error) {
        res.json(error);
    }
};

// DISTINT PROFESIONALES - CITAS RESERVADAS
exports.distinct_citas_dia = async (req, res) => {
    const query = `SELECT DISTINCT ID_PROFESIONAL AS ID, PROFESIONAL AS NOMBRE FROM LISTA_RESERVAS_CITAS_DIA`
    try {
        const datos = await db.sequelize.query(query);
        res.json(datos[0]);

    } catch (error) {
        res.json(error);
    }
};

//INSERTAR EN LISTA DE ESPERA
exports.insertar_lista = async (req, res) => {
    const id_cita = req.query.id_cita;

    const query = `INSERT INTO SALA_ESPERA(ID_CITA) VALUES ('${id_cita}')`
    try {
        const datos = await db.sequelize.query(query);
        res.json({id: 0, msg: 'Se ha insertado correctamente'});

    } catch (error) {
        res.json({id: 1, msg: 'Error'});
    }
}

//VISTA PACIENTES QUE YA LLEGARON
exports.obtener_pacientes_consultorio = async (req, res) => {
    const query = `SELECT * FROM LISTA_EN_CONSULTORIO`
    try {
        const datos = await db.sequelize.query(query);
        res.json(datos[0]);

    } catch (error) {
        res.json(error);
    }
};

// DISTINT PROFESIONALES - EN CONSULTORIO
exports.distinct_prof_consultorio = async (req, res) => {
    const query = `SELECT DISTINCT ID_PROFESIONAL AS ID, PROFESIONAL AS NOMBRE FROM LISTA_EN_CONSULTORIO`
    try {
        const datos = await db.sequelize.query(query);
        res.json(datos[0]);

    } catch (error) {
        res.json(error);
    }
};

// DISTINT PROFESIONALES - EN CONSULTORIO
exports.sacar_de_lista = async (req, res) => {
    const id_cita = req.query.id_cita;
    const query = `DELETE FROM SALA_ESPERA WHERE ID_CITA = ${id_cita}`

    try {
        const datos = await db.sequelize.query(query);
        res.json({id: 0, msg: 'Se ha modificado correctamente'});

    } catch (error) {
        res.json({id: 1, msg: 'Error'});
    }
};

//VISTA PROFESIONAL: EN ESPERA
exports.prof_espera = async (req, res) => {
    const query = `SELECT * FROM LISTA_EN_CONSULTORIO WHERE ID_PROFESIONAL = ${req.query.id_profesional} AND ESTADO = 'ESPERANDO'`
    try {
        const datos = await db.sequelize.query(query);
        res.json(datos[0]);

    } catch (error) {
        res.json(error);
    }
};

//VISTA PROFESIONAL: FINALIZADO
exports.prof_atendidos = async (req, res) => {
    const query = `SELECT * FROM LISTA_EN_CONSULTORIO WHERE ID_PROFESIONAL = ${req.query.id_profesional} AND ESTADO = 'FINALIZADO'`
    try {
        const datos = await db.sequelize.query(query);
        res.json(datos[0]);

    } catch (error) {
        res.json(error);
    }
};

//PROFESIONAL: VERIFICAR SI HAY CONSULTAS EN CURSO
exports.prof_verificar_consulta_curso = async (req, res) => {
    const query = `SELECT 
	                    COUNT(*) AS CANTIDAD
                   FROM SALA_ESPERA A
                   INNER JOIN CITAS B ON B.ID_CITA = A.ID_CITA
                   WHERE B.FECHA = CURRENT_DATE AND B.ID_PROFESIONAL = ${req.query.id_profesional} AND A.ID_ESTADO = 2`

    try {
        const datos = await db.sequelize.query(query);
        res.json(datos[0][0]);

    } catch (error) {
        res.json(error);
    }
}

//PROFESIONAL: OBTENER DATOS DEL PACIENTE ATENDIDO EN CURSO
exports.datos_en_curso_prof = async (req, res) => {
    const query = `SELECT * FROM LISTA_ATENCION_CURSO WHERE ID_PROFESIONAL = ${req.query.id_profesional}`

    try {
        const datos = await db.sequelize.query(query);
        res.json(datos[0][0]);

    } catch (error) {
        res.json(error);
    }
}

//INICIAR CONSULTA
exports.iniciar_consulta = async (req, res) => {
    const id = req.query.id_cita
    const query = `UPDATE SALA_ESPERA SET ID_ESTADO = 2, FECHA_ATENDIMIENTO = CURRENT_TIMESTAMP WHERE ID_CITA = ${id}`

    try {
        await db.sequelize.query(query);
        res.json({id: 0, msg: 'Se ha modificado correctamente'});

    } catch (error) {
        res.json({id: 1, msg: 'Error'});
    }
}

//FINALIZAR CONSULTA
exports.finalizar_consulta = async (req, res) => {
    const id = req.query.id_cita
    const query = `UPDATE SALA_ESPERA SET ID_ESTADO = 3, FECHA_FINALIZACION = CURRENT_TIMESTAMP WHERE ID_CITA = ${id};
                   UPDATE CITAS SET ESTADO = 4 WHERE ID_CITA = ${id}`

    try {
        await db.sequelize.query(query);
        res.json({id: 0, msg: 'Se ha modificado correctamente'});

    } catch (error) {
        res.json({id: 1, msg: 'Error'});
    }
}