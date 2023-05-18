const db = require('../models');

exports.obtener_tipos = async (req, res) => {
    const query = `SELECT * FROM TIPO_MOVIMIENTO`

    try {
        const data = await db.sequelize.query(query);
        res.json(data[0]);

    } catch (error) {
        res.json(error);
    }
};

exports.obtener_categorias = async (req, res) => {
    const id = req.query.cod || 1

    const query = `SELECT * FROM CATEGORIA_MOVIMIENTO WHERE ID_TIPO = ${id} AND ID <> 1`

    try {
        const data = await db.sequelize.query(query);
        res.json(data[0]);

    } catch (error) {
        res.json(error);
    }
};

exports.obtener_movimientos = async (req, res) => {
    const id_tipo = +req.query.id_tipo;
    const id_categoria = +req.query.id_categoria;
    const desde = req.query.desde;
    const hasta = req.query.hasta;

    let variable, uso;
    let variable2, uso2;
    
    if(id_tipo === 0){
        variable = `'0'`
        uso = '0'
    } else {
        variable = 'ID_TIPO_MOV'
        uso = id_tipo
    }

    if(id_categoria === 0){
        variable2 = `'0'`
        uso2 = '0'
    } else {
        variable2 = 'ID_CAT'
        uso2 = id_categoria
    }


    const query = `SELECT *
                   FROM MOVIMIENTOS_REGISTRADOS
                   WHERE ${variable} = ${uso} AND 
                         ${variable2} = ${uso2} AND
                         FECHA_FILTRO BETWEEN '${desde}' AND '${hasta}'`

    try {
        const data = await db.sequelize.query(query);
        res.json(data[0]);

    } catch (error) {
        res.json(error);
    }
}

exports.reg_movimiento = async (req, res) => {
    const monto = req.body.monto
    const tipo = req.body.tipo
    const categoria = req.body.categoria
    const nro_factura = req.body.nro_factura
    const comentario = req.body.comentario

    const query = `INSERT INTO MOVIMIENTOS (MONTO, TIPO, CATEGORIA, NRO_FACTURA, COMENTARIO)
                   VALUES(${monto}, ${tipo}, ${categoria}, '${nro_factura}','${comentario}')`

    try {
        await db.sequelize.query(query);
        res.json({id: 0});

    } catch (error) {
        res.json({id: 0, msg: error});
    }
}

exports.delete_movimiento = async (req, res) => {
    const id = req.query.id

    //const query = `DELETE FROM MOVIMIENTOS WHERE ID = ${id}` 
    const query = `UPDATE MOVIMIENTOS 
                   SET ESTADO = 'A'               
                   WHERE ID = ${id}` 

    try {
        await db.sequelize.query(query);
        res.json({id: 0});

    } catch (error) {
        res.json({id: 1, msg: error});
    }
}

exports.obtener_saldo = async (req, res) => {
    const query = `SELECT OBTENER_SALDO()` 

    try {
        const data = await db.sequelize.query(query);
        res.json(data[0][0].obtener_saldo);

    } catch (error) {
        res.json(error);
    }
}

exports.obtener_ing_eg = async (req, res) => {
    const id_tipo = +req.query.id_tipo;
    const id_categoria = +req.query.id_categoria;
    const desde = req.query.desde;
    const hasta = req.query.hasta;

    let variable, uso;
    let variable2, uso2;
    
    if(id_tipo === 0){
        variable = `'0'`
        uso = '0'
    } else {
        variable = 'ID_TIPO_MOV'
        uso = id_tipo
    }

    if(id_categoria === 0){
        variable2 = `'0'`
        uso2 = '0'
    } else {
        variable2 = 'ID_CAT'
        uso2 = id_categoria
    }

    const query = `SELECT 
                        ID_TIPO_MOV, 
                        SUM(IMPORTE) AS TOTAL
                   FROM MOVIMIENTOS_REGISTRADOS
                   WHERE ${variable} = ${uso} AND 
                   ${variable2} = ${uso2} AND
                   FECHA_FILTRO BETWEEN '${desde}' AND '${hasta}'
                   GROUP BY ID_TIPO_MOV`

    try {
        const data = await db.sequelize.query(query);
        res.json(data[0]);

    } catch (error) {
        res.json(error);
    }
}




exports.distinct_tipo_mov = async (req, res) => {
    const id_tipo = +req.query.id_tipo;
    const id_categoria = +req.query.id_categoria;
    const desde = req.query.desde;
    const hasta = req.query.hasta;

    let variable, uso;
    let variable2, uso2;
    
    if(id_tipo === 0){
        variable = `'0'`
        uso = '0'
    } else {
        variable = 'ID_TIPO_MOV'
        uso = id_tipo
    }

    if(id_categoria === 0){
        variable2 = `'0'`
        uso2 = '0'
    } else {
        variable2 = 'ID_CAT'
        uso2 = id_categoria
    }
          
    const query = `SELECT 
                        DISTINCT ID_TIPO_MOV AS ID, TIPO 
                   FROM MOVIMIENTOS_REGISTRADOS
                   WHERE ${variable} = ${uso} AND 
                   ${variable2} = ${uso2} AND
                   FECHA_FILTRO BETWEEN '${desde}' AND '${hasta}'`

    try {
        const data = await db.sequelize.query(query);
        res.json(data[0]);

    } catch (error) {
        res.json(error);
    }
}

exports.distinct_cat_mov = async (req, res) => {
    const id_tipo = +req.query.id_tipo;
    const id_categoria = +req.query.id_categoria;
    const desde = req.query.desde;
    const hasta = req.query.hasta;

    let variable, uso;
    let variable2, uso2;
    
    if(id_tipo === 0){
        variable = `'0'`
        uso = '0'
    } else {
        variable = 'ID_TIPO_MOV'
        uso = id_tipo
    }

    if(id_categoria === 0){
        variable2 = `'0'`
        uso2 = '0'
    } else {
        variable2 = 'ID_CAT'
        uso2 = id_categoria
    }

    const query = `SELECT 
                        DISTINCT ID_CAT AS ID, CONCEPTO AS CATEGORIA 
                   FROM MOVIMIENTOS_REGISTRADOS
                   WHERE ${variable} = ${uso} AND 
                   ${variable2} = ${uso2} AND
                   FECHA_FILTRO BETWEEN '${desde}' AND '${hasta}'`

    try {
        const data = await db.sequelize.query(query);
        res.json(data[0]);

    } catch (error) {
        res.json(error);
    }
}