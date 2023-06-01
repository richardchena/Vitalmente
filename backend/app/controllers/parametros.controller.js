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
    const query = `SELECT * FROM ESPECIALIDADES WHERE STATUS = 'A' ORDER BY ID_ESPECIALIDAD`

    try {
        const especialidades = await db.sequelize.query(query);
        res.json(especialidades[0]);

    } catch (error) {
        return null;
    }
};

exports.registrar_especialidades = async (req, res) => {
    const desc = req.body.descripcion
    const costo = req.body.costo
    const iva = req.body.iva

    const query = `INSERT INTO ESPECIALIDADES (DESCRIPCION, PRECIO, PORC_IVA)
                   VALUES ('${desc}', ${costo}, ${iva})`
                

    try {
        await db.sequelize.query(query);
        res.json({id: 0, msg: 'Registro insertado'});

    } catch (error) {
        res.json({id: 1, msg: 'Error al insertar'});
    }
};

exports.eliminar_especialidades = async (req, res) => {
    const id = req.query.id

    const query = `UPDATE ESPECIALIDADES SET STATUS = 'B' WHERE ID_ESPECIALIDAD = ${id}`
                
    try {
        const resp = await validar_eliminacion(id);

        if(resp.length === 1) {
            res.json({id: 1, msg: 'No se puede eliminar esta especialidad porque hay agendas de profesionales aún sin concluir'});
        } else {
            await db.sequelize.query(query);
            res.json({id: 0, msg: 'Registro eliminado'});
        }

        
    } catch (error) {
        res.json({id: 1, msg: 'Error al eliminar'});
    }
};

async function validar_eliminacion (id){
    const query = `SELECT 
                    DISTINCT B.ID_ESPECIALIDAD
                   FROM AGENDAS A
                   INNER JOIN DIAS_CONSULTA B ON B.ID_AGENDA = A.ID
                   WHERE A.FECHA_HASTA > CURRENT_DATE AND B.ID_ESPECIALIDAD = ${+id}`

    try {
        const datos = await db.sequelize.query(query);
        return {id: 0, msg: 'Ok', length: datos[0].length, id_esp: +id}

    } catch (error) {
        return {id: 0, msg: 'Ok'}
    }
}

exports.modificar_especialidades = async (req, res) => {
    const id = req.body.id
    const desc = req.body.descripcion
    const costo = req.body.costo
    const iva = req.body.iva

    const query = `UPDATE ESPECIALIDADES 
                   SET DESCRIPCION = '${desc}', PRECIO = ${costo}, PORC_IVA = ${iva}
                   WHERE ID_ESPECIALIDAD = ${id}`
                
    try {
        await db.sequelize.query(query);
        res.json({id: 0, msg: 'Registro modificado'});

    } catch (error) {
        res.json({id: 1, msg: 'Error al modificar'});
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
    /*const query = `SELECT U.EMAIL
    FROM CITAS C
    INNER JOIN PACIENTES P ON P.ID_PACIENTE = C.ID_PACIENTE
    INNER JOIN USERS U ON U.ID = P.ID_USUARIO
    WHERE C.ID_CITA = ${+req.query.id_cita}`*/

    const query = `SELECT 
            CASE 
                WHEN B.EMAIL IS NOT NULL THEN B.EMAIL
                WHEN U1.EMAIL IS NOT NULL THEN U1.EMAIL
                WHEN U2.EMAIL IS NOT NULL THEN U2.EMAIL
                WHEN U3.EMAIL IS NOT NULL THEN U3.EMAIL
                ELSE 
                    NULL
            END EMAIL
        FROM FACTURAS_VENTA A
        LEFT JOIN CLIENTE_FACTURA B ON B.ID = A.PERSONA_NO_CLIENTE
        LEFT JOIN PACIENTES PA ON PA.ID_PERSONA = A.PERSONA_CLIENTE
        LEFT JOIN PROFESIONALES PR ON PR.ID_PERSONA = A.PERSONA_CLIENTE
        LEFT JOIN ADMINISTRADORES AD ON AD.ID_PERSONA = A.PERSONA_CLIENTE
        LEFT JOIN USERS U1 ON U1.ID = PA.ID_USUARIO
        LEFT JOIN USERS U2 ON U2.ID = PR.ID_USUARIO
        LEFT JOIN USERS U3 ON U3.ID = AD.ID_USUARIO
        WHERE NUMERO_FACTURA = '${req.query.nro_factura}'`

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


exports.motivos_consultas = async (req, res) => {
    const query = `SELECT * FROM MOTIVOS_CONSULTA WHERE STATUS = 'A' ORDER BY ID;`

    try {
        const datos = await db.sequelize.query(query);
        res.json(datos[0]);

    } catch (error) {
        res.json(error);
    }
};

exports.motivos_consultas_insertar = async (req, res) => {
    const query = `INSERT INTO MOTIVOS_CONSULTA(DESCRIPCION) VALUES ('${req.query.descripcion}')`

    try {
        await db.sequelize.query(query);
        res.json({id: 0, msg: 'Motivo registrado correctamente'});

    } catch (error) {
        res.json({id: 1, msg: 'Error al registrar el motivo'});
    }
};

exports.diagnosticos_consultas_insertar = async (req, res) => {
    const query = `INSERT INTO DIAGNOSTICOS_CONSULTA(DESCRIPCION) VALUES ('${req.query.descripcion}')`

    try {
        await db.sequelize.query(query);
        res.json({id: 0, msg: 'Motivo registrado correctamente'});

    } catch (error) {
        res.json({id: 1, msg: 'Error al registrar el motivo'});
    }
};

exports.motivos_consultas_eliminar = async (req, res) => {
    const resp = await validar_eliminacion_motivo(+req.query.id);

    if(resp.length === 1) {
        res.json({id: 1, msg: 'No se puede eliminar este motivo ya que está siendo utilizado en algunas consultas'});
    } else {
        const query = `UPDATE MOTIVOS_CONSULTA SET STATUS = 'B' WHERE ID = ${req.query.id}`

        try {
            await db.sequelize.query(query);
            res.json({id: 0, msg: 'Motivo eliminado correctamente'});
    
        } catch (error) {
            res.json({id: 1, msg: 'Error al eliminar el motivo'});
        }
    }
};

exports.diagnostico_consultas_eliminar = async (req, res) => {
    /*const query = `UPDATE DIAGNOSTICOS_CONSULTA SET STATUS = 'B' WHERE ID = ${req.query.id}`

    try {
        await db.sequelize.query(query);
        res.json({id: 0, msg: 'Diagnóstico eliminado correctamente'});

    } catch (error) {
        res.json({id: 1, msg: 'Error al eliminar el diagnóstico'});
    }*/

    const resp = await validar_eliminacion_diagnostico(+req.query.id);

    if(resp.length === 1) {
        res.json({id: 1, msg: 'No se puede eliminar este diagnóstico ya que está siendo utilizado en algunas consultas'});
    } else {
        const query = `UPDATE DIAGNOSTICOS_CONSULTA SET STATUS = 'B' WHERE ID = ${req.query.id}`

        try {
            await db.sequelize.query(query);
            res.json({id: 0, msg: 'Diagnóstico eliminado correctamente'});
    
        } catch (error) {
            res.json({id: 1, msg: 'Error al eliminar el diagnóstico'});
        }
    }

};

exports.motivos_consultas_modificar = async (req, res) => {
    const query = `UPDATE MOTIVOS_CONSULTA SET DESCRIPCION = '${req.query.descripcion}' WHERE ID = ${req.query.id}`

    try {
        await db.sequelize.query(query);
        res.json({id: 0, msg: 'Motivo modificado correctamente'});

    } catch (error) {
        res.json({id: 1, msg: 'Error al modificar el motivo'});
    }
};

exports.diagnostico_consultas_modificar = async (req, res) => {
    const query = `UPDATE DIAGNOSTICOS_CONSULTA SET DESCRIPCION = '${req.query.descripcion}' WHERE ID = ${req.query.id}`

    try {
        await db.sequelize.query(query);
        res.json({id: 0, msg: 'Diagnóstico modificado correctamente'});

    } catch (error) {
        res.json({id: 1, msg: 'Error al modificar el diagnóstico'});
    }
};

exports.diagnosticos_consultas = async (req, res) => {
    const query = `SELECT * FROM DIAGNOSTICOS_CONSULTA WHERE STATUS = 'A' ORDER BY ID;`

    try {
        const datos = await db.sequelize.query(query);
        res.json(datos[0]);

    } catch (error) {
        res.json(error);
    }
};

async function validar_eliminacion_motivo (id){
    const query = `SELECT 
                    DISTINCT COD_MOTIVO
                    FROM CONSULTAS
                   WHERE COD_MOTIVO = ${+id}`

    try {
        const datos = await db.sequelize.query(query);
        return {id: 0, msg: 'Ok', length: datos[0].length}

    } catch (error) {
        return {id: 0, msg: 'Ok'}
    }
}

async function validar_eliminacion_diagnostico (id){
    const query = `SELECT 
                    DISTINCT COD_DIAGNOSTICO
                    FROM CONSULTAS
                   WHERE COD_DIAGNOSTICO = ${+id}`

    try {
        const datos = await db.sequelize.query(query);
        return {id: 0, msg: 'Ok', length: datos[0].length}

    } catch (error) {
        return {id: 0, msg: 'Ok'}
    }
}


exports.get_name_profesional_by_id = async (req, res) => {
    const query = `SELECT 
	A.ID_PROFESIONAL,
	INITCAP(F.PRIMER_NOMBRE || ' ' || COALESCE(F.SEGUNDO_NOMBRE, '') || ' ' || COALESCE(F.TERCER_NOMBRE, '')  || ' ' || F.PRIMER_APELLIDO || ' ' || COALESCE(F.SEGUNDO_APELLIDO, '')) PROFESIONAL
FROM PROFESIONALES A
INNER JOIN PERSONAS F ON F.ID_PERSONA = A.ID_PERSONA
WHERE A.ID_PROFESIONAL = ${req.query.id_profesional}`

    try {
        const datos = await db.sequelize.query(query);
        res.json(datos[0][0]);

    } catch (error) {
        res.json(error);
    }
};