const db = require('../models');
const path = require('path');

exports.registrar_contribuyente = async (req, res) => {
    const razon = req.body.razon;
    const alias = req.body.alias;
    const tipo = req.body.tipo;
    const ruc = req.body.ruc;
    const direccion = req.body.direccion;
    const ubi = req.body.ubi;
    const tel = req.body.tel;
    const email = req.body.email;
    const act = req.body.act;

    const query = `INSERT INTO CONTRIBUYENTES(RAZON_SOCIAL, ALIAS, TIPO_PERSONA, RUC, DIRECCION, UBICACION, TELEFONO, EMAIL, ACTIVIDAD) 
                   VALUES ('${razon}', '${alias}', '${tipo}', '${ruc}', '${direccion}', ${ubi}, '${tel}', '${email}', '${act}')`
    try {
        await db.sequelize.query(query);
        res.json({id: 0, msg: 'Se ha insertado correctamente'});

    } catch (error) {
        res.json({id: 1, msg: 'Error'});
    }
}

exports.listar_contribuyente = async (req, res) => {
    const query = `SELECT 
                        A.ID,
                        A.RAZON_SOCIAL AS RAZON,
                        A.ALIAS,
                        A.TIPO_PERSONA AS TIPO,
                        A.RUC,
                        A.ACTIVIDAD AS ACT,
                        INITCAP(B.DESCRIPCION || ' - ' || C.DESCRIPCION) AS UBI
                    FROM CONTRIBUYENTES A
                    INNER JOIN CIUDADES B ON B.COD_CONCATENADO = A.UBICACION
                    INNER JOIN DEPARTAMENTOS C ON C.ID_DEPARTAMENTO = B.ID_DEPARTAMENTO
                    WHERE A.STATUS = 'A' 
                    ORDER BY A.ID`
    try {
        const data = await db.sequelize.query(query);
        res.json(data[0]);

    } catch (error) {
        res.json({id: 1, msg: 'Error'});
    }
}

exports.eliminar_contribuyente = async (req, res) => {
    const query = `UPDATE CONTRIBUYENTES SET STATUS = 'B' WHERE ID = ${req.query.id}`
    try {
        await db.sequelize.query(query);
        res.json({id: 0, msg: 'Se ha eliminado correctamente'});

    } catch (error) {
        res.json({id: 1, msg: error});
    }
}

exports.datos_modificar = async (req, res) => {
    const query = `SELECT A.*, B.ID_DEPARTAMENTO 
                   FROM CONTRIBUYENTES A
                   INNER JOIN CIUDADES B ON B.COD_CONCATENADO = A.UBICACION
                   WHERE A.ID = ${req.query.id}`
    try {
        const data = await db.sequelize.query(query);
        res.json(data[0][0]);

    } catch (error) {
        res.json({id: 1, msg: error});
    }
}

exports.modificar_contribuyente = async (req, res) => {
    const id = req.body.id;
    const razon = req.body.razon;
    const alias = req.body.alias;
    const tipo = req.body.tipo;
    const ruc = req.body.ruc;
    const direccion = req.body.direccion;
    const ubi = req.body.ubi;
    const tel = req.body.tel;
    const email = req.body.email;
    const act = req.body.act;

    const query =  `UPDATE CONTRIBUYENTES
                    SET RAZON_SOCIAL = '${razon}', ALIAS = '${alias}', TIPO_PERSONA = '${tipo}', RUC = '${ruc}', DIRECCION = '${direccion}', UBICACION =  ${ubi}, TELEFONO = '${tel}', EMAIL = '${email}', ACTIVIDAD = '${act}'
                    WHERE ID = ${id}`

    try {
        await db.sequelize.query(query);
        res.json({id: 0, msg: 'Se ha modificado correctamente'});

    } catch (error) {
        res.json({id: 1, msg: 'Error'});
    }
}

exports.reg_timbrado = async (req, res) => {
    const contribuyente = req.body.contribuyente;
    const nro = req.body.nro;
    const est = req.body.est;
    const exp = req.body.exp;
    const desde = req.body.rango_inicio;
    const hasta = req.body.rango_final;
    const fec_desde = req.body.inicio;
    const fec_hasta = req.body.fin;

    const query = `INSERT INTO TIMBRADOS(contribuyente, nro_timbrado, establecimineto, expedicion, nro_desde, nro_hasta, fecha_desde, fecha_hasta) 
                   VALUES (${contribuyente}, ${nro}, ${est}, ${exp}, ${desde}, ${hasta}, '${fec_desde}', '${fec_hasta}')`
    try {
        await db.sequelize.query(query);
        res.json({id: 0, msg: 'Se ha insertado correctamente'});

    } catch (error) {
        res.json({id: 1, msg: 'Error'});
    }
}


exports.distinct_ruc = async (req, res) => {
    const query = `SELECT DISTINCT ID, RUC FROM CONTRIBUYENTES`
    try {
        const data = await db.sequelize.query(query);
        res.json(data[0]);

    } catch (error) {
        res.json(error);
    }
}

exports.lista_timbrados = async (req, res) => {
    const query = `SELECT
                        A.ID,
                        B.RUC,
                        A.NRO_TIMBRADO,
                        'FACTURA' AS TIPO_DOC,
                        LPAD(CAST(A.ESTABLECIMINETO AS VARCHAR), 3, '0') AS EST,
                        LPAD(CAST(A.EXPEDICION AS VARCHAR), 3, '0') AS EXP,
                        NRO_DESDE::VARCHAR || ' - ' || NRO_HASTA::VARCHAR AS RANGO,
                        TO_CHAR(FECHA_DESDE, 'dd/mm/YYYY') AS FECHA_DESDE,
                        TO_CHAR(FECHA_HASTA, 'dd/mm/YYYY') AS FECHA_HASTA,
                        CASE A.STATUS
                            WHEN 'A' THEN 'ACTIVO'
                            WHEN 'B' THEN 'BAJA'
                            ELSE 'INACTIVO'
                        END AS ESTADO
                        FROM TIMBRADOS A
                        INNER JOIN CONTRIBUYENTES B ON B.ID = A.CONTRIBUYENTE
                        WHERE A.STATUS = 'A'
                        ORDER BY A.ID DESC`
    try {
        const data = await db.sequelize.query(query);
        res.json(data[0]);

    } catch (error) {
        res.json(error);
    }
}

exports.eliminar_timbrado = async (req, res) => {
    const query = `UPDATE TIMBRADOS SET STATUS = 'B' WHERE ID = ${req.query.id}`
    try {
        await db.sequelize.query(query);
        res.json({id: 0, msg: 'Se ha eliminado correctamente'});

    } catch (error) {
        res.json({id: 1, msg: error});
    }
}

exports.modificar_timbrado = async (req, res) => {
    const contribuyente = req.body.contribuyente;
    const nro = req.body.nro;
    const est = req.body.est;
    const exp = req.body.exp;
    const desde = req.body.rango_inicio;
    const hasta = req.body.rango_final;
    const fec_desde = req.body.inicio;
    const fec_hasta = req.body.fin;
    const id = req.body.id;

    const query =  `UPDATE TIMBRADOS
                    SET CONTRIBUYENTE = ${contribuyente}, NRO_TIMBRADO = ${nro}, establecimineto = ${est}, expedicion = ${exp}, nro_desde = ${desde}, nro_hasta =  ${hasta}, fecha_desde = '${fec_desde}', fecha_hasta = '${fec_hasta}'
                    WHERE ID = ${id}`

    try {
        await db.sequelize.query(query);
        res.json({id: 0, msg: 'Se ha modificado correctamente'});

    } catch (error) {
        res.json({id: 1, msg: 'Error'});
    }
}

exports.datos_modificar_timbrado = async (req, res) => {
    const query = `SELECT A.*
                   FROM TIMBRADOS A
                   WHERE A.ID = ${req.query.id}`
    try {
        const data = await db.sequelize.query(query);
        res.json(data[0][0]);

    } catch (error) {
        res.json({id: 1, msg: error});
    }
}

exports.generar_archivo = async (req, res) => {
    const id = req.query.id

    /*try {
        let text="hello world";
        res.setHeader('Content-type', "application/octet-stream");
        res.setHeader('Content-disposition', 'attachment; filename=file.txt');
        res.send(text);

    } catch (error) {
        res.json({id: 1, msg: error});
    }*/

    let path_pdf = path.join(__dirname, `../assets/facturas/${id}.pdf`)
    res.sendFile(path_pdf);
    
    //res.send({org: __dirname, modif: path.join(__dirname, '../facturas_emitidas/')})
}


exports.datos_cliente = async (req, res) => {
        const query = `WITH TABLA AS (
        SELECT
            P.NRO_DOC || ' ' || INITCAP(P.PRIMER_NOMBRE || ' ' || COALESCE(P.SEGUNDO_NOMBRE, '') || ' ' || COALESCE(P.TERCER_NOMBRE, '')  || ' ' || P.PRIMER_APELLIDO || ' ' || COALESCE(P.SEGUNDO_APELLIDO, '')) COMPLETO,
            P.ID_PERSONA,
            P.PRIMER_NOMBRE,
            P.SEGUNDO_NOMBRE,
            P.TERCER_NOMBRE,
            P.PRIMER_APELLIDO,
            P.SEGUNDO_APELLIDO,
            T.DESCRIPCION AS TIPO,
            P.NRO_DOC,
            P.TIPO_DOC,
            P.DIRECCION,
            P.LUGAR_RESIDENCIA AS CIUDAD,
            C.ID_DEPARTAMENTO AS DEPARTAMENTO,
            CASE 
                WHEN U1.EMAIL IS NOT NULL THEN U1.EMAIL
                WHEN U2.EMAIL IS NOT NULL THEN U2.EMAIL
                WHEN U3.EMAIL IS NOT NULL THEN U3.EMAIL
                ELSE 
                    NULL
            END EMAIL,
            'TABLA_PERSONAS' AS TABLA
        FROM PERSONAS P
        LEFT JOIN TIPOS_DOCUMENTO T ON T.ID = P.TIPO_DOC
        LEFT JOIN CIUDADES C ON C.COD_CONCATENADO = P.LUGAR_RESIDENCIA
        LEFT JOIN PACIENTES PA ON PA.ID_PERSONA = P.ID_PERSONA
        LEFT JOIN PROFESIONALES PR ON PR.ID_PERSONA = P.ID_PERSONA
        LEFT JOIN ADMINISTRADORES AD ON AD.ID_PERSONA = P.ID_PERSONA
        LEFT JOIN USERS U1 ON U1.ID = PA.ID_USUARIO
        LEFT JOIN USERS U2 ON U2.ID = PR.ID_USUARIO
        LEFT JOIN USERS U3 ON U3.ID = AD.ID_USUARIO
        UNION

        SELECT
            P.NRO_DOC || ' ' || INITCAP(P.PRIMER_NOMBRE || ' ' || COALESCE(P.SEGUNDO_NOMBRE, '') || ' ' || COALESCE(P.TERCER_NOMBRE, '')  || ' ' || P.PRIMER_APELLIDO || ' ' || COALESCE(P.SEGUNDO_APELLIDO, '')) COMPLETO,
            P.ID AS ID_PERSONA,
            P.PRIMER_NOMBRE,
            P.SEGUNDO_NOMBRE,
            P.TERCER_NOMBRE,
            P.PRIMER_APELLIDO,
            P.SEGUNDO_APELLIDO,
            T.DESCRIPCION AS TIPO,
            P.NRO_DOC,
            P.TIPO_DOC,
            P.DIRECCION,
            P.CIUDAD AS CIUDAD,
            C.ID_DEPARTAMENTO AS DEPARTAMENTO,
            P.EMAIL,
            'TABLA_CLIENTES' AS TABLA
        FROM CLIENTE_FACTURA P
        INNER JOIN TIPOS_DOCUMENTO T ON T.ID = P.TIPO_DOC
        INNER JOIN CIUDADES C ON C.COD_CONCATENADO = P.CIUDAD)
    
    SELECT * FROM TABLA
    WHERE NRO_DOC = '${req.query.nro_doc}'`

    try {
        const data = await db.sequelize.query(query);
        res.json(data[0][0]);

    } catch (error) {
        res.json({});
    }
}

exports.registrar_cliente = async (req, res) => {
    const pri_nom = req.body.pri_nom
    let seg_nom = req.body.seg_nom
    let ter_nom = req.body.ter_nom
    const pri_ape = req.body.pri_ape
    let seg_ape = req.body.seg_ape
    const tipo_doc = req.body.tipo_doc
    const nro_doc = req.body.nro_doc
    const dir = req.body.dir
    const lug = req.body.lug
    const email = req.body.email

    let seg_nom_final, ter_nom_final, seg_ape_final;

    if(!seg_nom) 
        seg_nom_final = null 
    else
        seg_nom_final = `'${seg_nom}'`

    if(!ter_nom) 
        ter_nom_final = null 
    else
        ter_nom_final = `'${ter_nom}'`
        
    if(!seg_ape) 
        seg_ape_final = null 
    else
        seg_ape_final = `'${seg_ape}'`

    const query = `WITH ROWS AS (	
        INSERT INTO CLIENTE_FACTURA(PRIMER_NOMBRE, SEGUNDO_NOMBRE, TERCER_NOMBRE, PRIMER_APELLIDO, SEGUNDO_APELLIDO, TIPO_DOC, NRO_DOC, DIRECCION, CIUDAD, EMAIL)
        VALUES(UPPER('${pri_nom}'), UPPER(${seg_nom_final}), UPPER(${ter_nom_final}), UPPER('${pri_ape}'), UPPER(${seg_ape_final}), ${tipo_doc}, '${nro_doc}', '${dir}', ${lug}, '${email}') RETURNING ID, NRO_DOC, PRIMER_NOMBRE, SEGUNDO_NOMBRE, TERCER_NOMBRE, PRIMER_APELLIDO, SEGUNDO_APELLIDO
    ) SELECT 
        ID, 
        'TABLA_CLIENTES' AS TABLA,
        NRO_DOC || ' ' || UPPER(PRIMER_NOMBRE || ' ' || COALESCE(SEGUNDO_NOMBRE, '') || ' ' || COALESCE(TERCER_NOMBRE, '')  || ' ' || PRIMER_APELLIDO || ' ' || COALESCE(SEGUNDO_APELLIDO, '')) COMPLETO
      FROM ROWS`

    try {
        const data = await db.sequelize.query(query);
        res.json(data[0][0]);

    } catch (error) {
        res.json({});
    }
}

exports.consulta_persona = async (req, res) => {
    const query = `SELECT COUNT(*) AS CANTIDAD
    FROM PERSONAS
    WHERE NRO_DOC = '${req.query.nro_doc}' AND TIPO_DOC = ${req.query.tipo_doc}`

    try {
        const data = await db.sequelize.query(query);
        res.json(data[0][0]);

    } catch (error) {
        res.json({});
    }
}

exports.modificar_cliente = async (req, res) => {
    const id = req.body.id
    const pri_nom = req.body.pri_nom
    let seg_nom = req.body.seg_nom
    let ter_nom = req.body.ter_nom
    const pri_ape = req.body.pri_ape
    let seg_ape = req.body.seg_ape
    const tipo_doc = req.body.tipo_doc
    const nro_doc = req.body.nro_doc
    const dir = req.body.dir
    const tabla = req.body.tabla
    const lug = req.body.lug
    const email = req.body.email

    let seg_nom_final, ter_nom_final, seg_ape_final, query;

    if(!seg_nom) 
        seg_nom_final = null 
    else
        seg_nom_final = `'${seg_nom}'`

    if(!ter_nom) 
        ter_nom_final = null 
    else
        ter_nom_final = `'${ter_nom}'`
        
    if(!seg_ape) 
        seg_ape_final = null 
    else
        seg_ape_final = `'${seg_ape}'`

    if(tabla === 'TABLA_PERSONAS'){
        query = `UPDATE PERSONAS
                 SET PRIMER_NOMBRE = '${pri_nom}', SEGUNDO_NOMBRE = ${seg_nom_final}, TERCER_NOMBRE = ${ter_nom_final}, PRIMER_APELLIDO = '${pri_ape}', SEGUNDO_APELLIDO = ${seg_ape_final}, TIPO_DOC = ${tipo_doc}, NRO_DOC = '${nro_doc}', DIRECCION = '${dir}', LUGAR_RESIDENCIA = ${lug}
                 WHERE ID_PERSONA = ${id};
                 SELECT CAMBIAR_MAIL(${id}, '${email}');`
    } else {
        query = `UPDATE CLIENTE_FACTURA
                 SET PRIMER_NOMBRE = '${pri_nom}', SEGUNDO_NOMBRE = ${seg_nom_final}, TERCER_NOMBRE = ${ter_nom_final}, PRIMER_APELLIDO = '${pri_ape}', SEGUNDO_APELLIDO = ${seg_ape_final}, TIPO_DOC = ${tipo_doc}, NRO_DOC = '${nro_doc}', DIRECCION = '${dir}', CIUDAD = ${lug}, EMAIL = '${email}'
                 WHERE ID = ${id}`
    }

    try {
        await db.sequelize.query(query);
        res.json({id: 0});

    } catch (error) {
        res.json({id: 1});
    }
}