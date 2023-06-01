const db = require('../models');

exports.total_cliente_genero = async (req, res) => {
    const query = `SELECT
                        CASE GENERO
                            WHEN 'M' THEN 'MASCULINO'
                            WHEN 'F' THEN 'FEMENINO'
                            ELSE 'OTROS'
                        END AS GENERO,
                        COUNT(*) AS CANTIDAD
                    FROM PACIENTES A
                    INNER JOIN PERSONAS B ON B.ID_PERSONA = A.ID_PERSONA
                    GROUP BY GENERO;`
    try {
        const datos = await db.sequelize.query(query);
        res.json(datos[0])

    } catch (error) {
        res.json(error);
    }
};

exports.total_cliente_edades = async (req, res) => {
    const query = `WITH TEMP1 AS (
                        SELECT
                            *, CAST(EXTRACT (YEAR FROM AGE(CURRENT_DATE, B.FECHA_NACIMIENTO)) AS INTEGER) AS EDAD
                        FROM PACIENTES A
                        INNER JOIN PERSONAS B ON B.ID_PERSONA = A.ID_PERSONA
                    ),
                    
                    TEMP2 AS (
                        SELECT *, 
                            CASE
                            WHEN EDAD <= 17 THEN 'MENORES'
                            WHEN EDAD > 17 AND EDAD < 65 THEN 'ADULTOS'
                            ELSE 'ADULTOS MAYORES'
                        END AS CATEG_EDAD
                        FROM TEMP1
                    )
                    
                    SELECT 
                        CATEG_EDAD,
                        COUNT(*) AS CANTIDAD
                    FROM TEMP2
                    GROUP BY CATEG_EDAD;`
    try {
        const datos = await db.sequelize.query(query);
        res.json(datos[0])

    } catch (error) {
        res.json(error);
    }
};

exports.total_pacientes = async (req, res) => {
    const query = 'SELECT COUNT(*) AS TOTAL FROM PACIENTES'

    try {
        const datos = await db.sequelize.query(query);
        res.json(datos[0][0])

    } catch (error) {
        res.json(error);
    }
}

exports.total_consultas = async (req, res) => {    
    const mes = req.query.mes;
    const anho = req.query.anho;

    let query;

    if(!mes && !anho){
        query = `SELECT 
                    CASE
                        WHEN COD_FACTURA IS NULL THEN 'PENDIENTES'
                        ELSE 'FINALIZADAS'
                    END AS TIPO,
                    COUNT(*) AS CANTIDAD
                FROM CITAS
                WHERE ESTADO = 4
                GROUP BY TIPO
                UNION
                SELECT 'EN CURSO' AS TIPO, COUNT(*) AS CANTIDAD 
                FROM SALA_ESPERA
                WHERE ID_ESTADO = 2`
    } else {
        query = `SELECT 
                    CASE
                        WHEN COD_FACTURA IS NULL THEN 'PENDIENTES'
                        ELSE 'FINALIZADAS'
                    END AS TIPO,
                    COUNT(*) AS CANTIDAD
                FROM CITAS
                WHERE ESTADO = 4 AND EXTRACT(MONTH FROM FECHA) = ${mes} AND EXTRACT(YEAR FROM FECHA) = ${anho}
                GROUP BY TIPO
                UNION
                SELECT 'EN CURSO' AS TIPO, COUNT(*) AS CANTIDAD 
                FROM SALA_ESPERA
                WHERE ID_ESTADO = 2`
    }

    try {
        const datos = await db.sequelize.query(query);
        res.json(datos[0])

    } catch (error) {
        res.json(error);
    }
}


exports.total_citas = async (req, res) => {
    const mes = req.query.mes;
    const anho = req.query.anho;

    let query;

    if(!mes && !anho){
        query = `WITH TEMP1 AS (
            SELECT A.*, B.*,
                CASE
                    WHEN A.ESTADO = 1 THEN 'AUSENTES'
                    WHEN A.ESTADO IN (2,3) THEN 'CANCELADOS'
                    WHEN A.ESTADO = 4 THEN 'ASISTIDAS'
                    ELSE 'OTROS'
                END AS CATEG_CITAS
            FROM CITAS A
            INNER JOIN ESTADOS_CITA B ON B.ID = A.ESTADO
            WHERE FECHA < CURRENT_DATE
            )

        SELECT 
            CATEG_CITAS,
            COUNT(*) AS CANTIDAD
        FROM TEMP1
        GROUP BY CATEG_CITAS
        UNION
        SELECT 'PENDIENTES' AS categ_citas, COUNT(*) 
        FROM CITAS
        WHERE FECHA >= CURRENT_DATE AND 
              ESTADO = 1 AND 
              COD_FACTURA IS NULL`
    } else {
        query = `WITH TEMP1 AS (
            SELECT A.*, B.*,
                CASE
                    WHEN A.ESTADO = 1 THEN 'AUSENTES'
                    WHEN A.ESTADO IN (2,3) THEN 'CANCELADOS'
                    WHEN A.ESTADO = 4 THEN 'ASISTIDAS'
                    ELSE 'OTROS'
                END AS CATEG_CITAS
            FROM CITAS A
            INNER JOIN ESTADOS_CITA B ON B.ID = A.ESTADO
            WHERE FECHA < CURRENT_DATE
            )

        SELECT 
            CATEG_CITAS,
            COUNT(*) AS CANTIDAD
        FROM TEMP1
        WHERE EXTRACT(MONTH FROM FECHA) = ${mes} AND EXTRACT(YEAR FROM FECHA) = ${anho}
        GROUP BY CATEG_CITAS
        UNION
        SELECT 'PENDIENTES' AS categ_citas, COUNT(*) 
        FROM CITAS
        WHERE FECHA >= CURRENT_DATE AND 
              ESTADO = 1 AND 
              COD_FACTURA IS NULL;`
    }

    try {
        const datos = await db.sequelize.query(query);
        res.json(datos[0])

    } catch (error) {
        res.json(error);
    }
};


exports.especialidades = async (req, res) => {
    const mes = req.query.mes
    const anho = req.query.anho

    let query;

    if(+mes === 0 && +anho === 0) {
        query = `SELECT 
                    COUNT(A.*) AS VALUE,
                    B.DESCRIPCION AS NAME
                FROM CONSULTAS A
                INNER JOIN ESPECIALIDADES B ON B.ID_ESPECIALIDAD = A.ID_ESPECIALIDAD
                GROUP BY B.DESCRIPCION`
    } else {
        query = `SELECT 
                    COUNT(A.*) AS VALUE,
                    B.DESCRIPCION AS NAME
                FROM CONSULTAS A
                INNER JOIN ESPECIALIDADES B ON B.ID_ESPECIALIDAD = A.ID_ESPECIALIDAD
                WHERE EXTRACT(YEAR FROM A.FECHA_CONSULTA) = ${+anho} AND EXTRACT(MONTH FROM A.FECHA_CONSULTA) = ${+mes + 1}
                GROUP BY B.DESCRIPCION`
    }

    try {
        const datos = await db.sequelize.query(query);
        res.json(datos[0])

    } catch (error) {
        res.json(error);
    }
}

exports.motivos = async (req, res) => {
    const mes = req.query.mes
    const anho = req.query.anho

    let query;

    if(+mes === 0 && +anho === 0) {
        query = `SELECT 
        B.DESCRIPCION AS NAME,
        COUNT(A.*) AS VALUE
        FROM CONSULTAS A
        INNER JOIN MOTIVOS_CONSULTA B ON B.ID = A.COD_MOTIVO
        GROUP BY B.DESCRIPCION`

    } else {
        query = `SELECT 
        B.DESCRIPCION AS NAME,
        COUNT(A.*) AS VALUE
        FROM CONSULTAS A
        INNER JOIN MOTIVOS_CONSULTA B ON B.ID = A.COD_MOTIVO
        WHERE EXTRACT(YEAR FROM A.FECHA_CONSULTA) = ${+anho} AND EXTRACT(MONTH FROM A.FECHA_CONSULTA) = ${+mes + 1}
        GROUP BY B.DESCRIPCION`
    }

    try {
        const datos = await db.sequelize.query(query);
        res.json(datos[0])

    } catch (error) {
        res.json(error);
    }
}

exports.diagnosticos = async (req, res) => {
    const mes = req.query.mes
    const anho = req.query.anho

    let query;

    if(+mes === 0 && +anho === 0) {
        query = `SELECT 
        B.DESCRIPCION AS NAME,
        COUNT(A.*) AS VALUE
        FROM CONSULTAS A
        INNER JOIN DIAGNOSTICOS_CONSULTA B ON B.ID = A.COD_DIAGNOSTICO
        GROUP BY B.DESCRIPCION`
    } else {
        query = `SELECT 
        B.DESCRIPCION AS NAME,
        COUNT(A.*) AS VALUE
        FROM CONSULTAS A
        INNER JOIN DIAGNOSTICOS_CONSULTA B ON B.ID = A.COD_DIAGNOSTICO
        WHERE EXTRACT(YEAR FROM A.FECHA_CONSULTA) = ${+anho} AND EXTRACT(MONTH FROM A.FECHA_CONSULTA) = ${+mes + 1}
        GROUP BY B.DESCRIPCION`
    }




    try {
        const datos = await db.sequelize.query(query);
        res.json(datos[0])

    } catch (error) {
        res.json(error);
    }
}

exports.ingresos_egresos_diario = async (req, res) => {
    const mes = req.query.mes
    let valor;

    if(+mes === 1) {
        valor = 5
    } else {
        valor = 6
    }

    const query = `SELECT 
                        SUM(A.MONTO) AS MONTO,
                        B.DESCRIPCION AS TIPO,
                        EXTRACT(DAY FROM A.FECHA_CREACION) AS DIA,
                        EXTRACT(MONTH FROM A.FECHA_CREACION) AS MES,
                        EXTRACT(YEAR FROM A.FECHA_CREACION) AS ANHO
                    FROM MOVIMIENTOS A
                    INNER JOIN TIPO_MOVIMIENTO B ON B.ID = A.TIPO
                    WHERE A.ESTADO = 'V' AND EXTRACT(MONTH FROM A.FECHA_CREACION) = ${valor}
                    GROUP BY TIPO, MES, ANHO, DIA, B.DESCRIPCION
                    ORDER BY DIA, MES, ANHO`

    try {
        const datos = await db.sequelize.query(query);
        res.json(datos[0])

    } catch (error) {
        res.json(error);
    }
}

exports.ingresos_egresos_mensual = async (req, res) => {
    const query = `SELECT 
	SUM(A.MONTO) AS MONTO,
	B.DESCRIPCION AS TIPO,
	EXTRACT(MONTH FROM A.FECHA_CREACION) AS MES,
	EXTRACT(YEAR FROM A.FECHA_CREACION) AS ANHO
FROM MOVIMIENTOS A
INNER JOIN TIPO_MOVIMIENTO B ON B.ID = A.TIPO
WHERE A.ESTADO = 'V'
GROUP BY TIPO, MES, ANHO, B.DESCRIPCION`

    try {
        const datos = await db.sequelize.query(query);
        res.json(datos[0])

    } catch (error) {
        res.json(error);
    }
}