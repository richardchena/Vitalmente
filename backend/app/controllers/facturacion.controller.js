const db = require('../models');
const PdfPrinter = require('pdfmake');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const mail = require("../config/mailer");

exports.correo = async (req, res) => {
    try {
        const resp = await enviar_comprobante(req.query.email, req.query.nro_factura, req.query.id_pdf);
        res.json({id: resp});

    } catch (error) {
        res.json({id: 1});
    }
}

async function enviar_comprobante(email, nro_factura, id_pdf){
    let resp;
    let pdf = path.join(__dirname, `../assets/facturas/${id_pdf}.pdf`)

    await mail.transporter.sendMail({
        from: '"facturas" tparqweb@gmail.com>',
        to: email,
        subject: `Factura Digital ${nro_factura}`,
        html: `
            <p>Estimado cliente,
            <p>Adjuntamos su factura digital, agradecemos su pago :D

            <strong><p>Si tiene dificultad para visualizar el documento favor contactar con atención al cliente.</p></strong>
            <p>Saludos cordiales</p>
            <p>Atte. Clínica VitalMente</p>
        `,
        attachments: [
            {
                filename: `${id_pdf}.pdf`,
                path: pdf,
                cid: `${id_pdf}.pdf`
            }
        ]
    })
    .then(data => {
        resp = {id: 0, msg: data}
    })
    .catch(err => {
        resp = {id: 1, msg: err}
    });

    return resp
}

exports.generar_factura = async (req, res) => {
    const id_timbrado = req.body.id_timbrado;
    const condicion = req.body.condicion;
    const id_cita = req.body.id_cita;
    const id_persona = req.body.id_persona;
    const tabla = req.body.tabla;

    const query = `SELECT GENERAR_FACTURA(${id_timbrado}, '${condicion}', ${id_cita}, ${id_persona}, '${tabla}')`

    try {
        const data = await db.sequelize.query(query);
        let resp = +data[0][0].generar_factura
        res.json({id: resp});

    } catch (error) {
        res.json({id: 0});
    }
};

exports.agregar_item = async (req, res) => {
    const id_factura = req.body.id_factura;
    const id_esp = req.body.id_esp;
    const cantidad = req.body.cantidad;

    const query = `SELECT AGREGAR_ITEM_FACTURA(${id_factura}, ${id_esp}, ${cantidad})`

    try {
        const data = await db.sequelize.query(query);
        let resp = +data[0][0].agregar_item_factura
        res.json({id: resp});

    } catch (error) {
        res.json({id: 0});
    }
};

exports.emitir = async (req, res) => {
    const id_factura = req.body.id_factura;
    const id_pdf = generar_id()

    const query = `SELECT EMITIR_FACTURA(${id_factura}, '${id_pdf}')`

    //try {
        const data = await db.sequelize.query(query);
        const cabecera = await cabecera_factura(id_factura);
        const detalles = await detalle_factura(id_factura);
        await generar_pdf(cabecera[0], detalles, id_pdf, id_factura);
        let resp = data[0][0].emitir_factura
        res.json({nro: resp, id_pdf: id_pdf});

    /*} catch (error) {
        res.json({nro: null});
    }*/
}


exports.consulta_item = async (req, res) => {
    const id_cita = req.query.id_cita;

    const query = `SELECT 
                        A.ID_ESPECIALIDAD,
                        B.ID_PERSONA,
                        TO_CHAR(A.FECHA, 'DD/MM/YYYY') || ' ' || TO_CHAR(A.HORA, 'HH24:MI') AS FECHA,
                        C.NRO_DOC || ' ' || UPPER(C.PRIMER_NOMBRE || ' ' || COALESCE(C.SEGUNDO_NOMBRE, '') || ' ' || COALESCE(C.TERCER_NOMBRE, '')  || ' ' || C.PRIMER_APELLIDO || ' ' || COALESCE(C.SEGUNDO_APELLIDO, '')) AS COMPLETO,
                        UPPER(C.PRIMER_NOMBRE || ' ' || COALESCE(C.SEGUNDO_NOMBRE, '') || ' ' || COALESCE(C.TERCER_NOMBRE, '')  || ' ' || C.PRIMER_APELLIDO || ' ' || COALESCE(C.SEGUNDO_APELLIDO, '')) AS NOMBRE
                   FROM CITAS A
                   INNER JOIN PACIENTES B ON B.ID_PACIENTE = A.ID_PACIENTE
                   INNER JOIN PERSONAS C ON C.ID_PERSONA = B.ID_PERSONA
                   WHERE ID_CITA = ${id_cita} AND COD_FACTURA IS NULL`

    try {
        const data = await db.sequelize.query(query);
        res.json(data[0][0]);

    } catch (error) {
        res.json({id_especialidad: null});
    }
}

exports.consulta_vinculo = async (req, res) => {
    const fac = req.body.nro_factura;
    const item = req.body.id_item;
    const cita = req.body.id_cita;

    const query = `SELECT CONSULTA_VINCULAR_FACTURA('${fac}', ${item}, ${cita})`

    try {
        const data = await db.sequelize.query(query);
        res.json({id: data[0][0].consulta_vincular_factura});

    } catch (error) {
        res.json({id: 3});
    }
}

exports.obtener_clientes_pendientes_pago = async (req, res) => {
    const id_estado_pago = req.query.id_estado_pago || 0;
    const mes = req.query.mes //|| new Date().getMonth() + 1;
    const anho = req.query.anho //|| new Date().getFullYear();

    let variable, uso;
    let v, u;
    let v2, u2;

    if(!mes){
        v = `'0'`
        u = `'0'`
    } else {
        v = 'EXTRACT(MONTH FROM FECHA_CONSULTA)'
        u = mes
    }

    if(!anho){
        v2 = `'0'`
        u2 = `'0'`
    } else {
        v2 = 'EXTRACT(YEAR FROM FECHA_CONSULTA)'
        u2 = anho
    }

    if(id_estado_pago === 0 || id_estado_pago === '0'){
        variable = `'0'`
        uso = '0'
    } else {
        variable = 'ID_ESTADO_PAGO'
        uso = id_estado_pago
    }

    const query = `WITH TEMP AS (
    SELECT
    A.ID_CITA,
    A.ID_PACIENTE AS NRO_EXP,
    INITCAP(E.PRIMER_NOMBRE || ' ' || E.PRIMER_APELLIDO) AS PACIENTE,
    B.ID_ESPECIALIDAD,
    B.DESCRIPCION AS ESPECIALIDAD,
    TO_CHAR(C.FECHA_FINALIZACION, 'DD/MM/YYYY HH24:MI') AS FECHA,
    COALESCE(TO_CHAR(F.FECHA_EMISION, 'DD/MM/YYYY HH24:MI'), 'No aplica') AS FECHA_PAGO,
    C.FECHA_FINALIZACION AS FECHA_CONSULTA,
    trim(TO_CHAR(B.PRECIO, '999G999')) || ' Gs.' AS TOTAL,
    CASE
        WHEN A.COD_FACTURA IS NULL THEN 1
        ELSE 2
    END AS ID_ESTADO_PAGO,
    CASE
        WHEN A.COD_FACTURA IS NULL THEN 'Pendiente'
        ELSE 'Finalizado'
    END AS ESTADO,
    COALESCE(F.NUMERO_FACTURA, 'No aplica') AS NUMERO_FACTURA
    FROM CITAS A
    INNER JOIN ESPECIALIDADES B ON B.ID_ESPECIALIDAD = A.ID_ESPECIALIDAD
    INNER JOIN SALA_ESPERA C ON C.ID_CITA = A.ID_CITA
    INNER JOIN PACIENTES D ON D.ID_PACIENTE = A.ID_PACIENTE
    INNER JOIN PERSONAS E ON E.ID_PERSONA = D.ID_PERSONA
    LEFT JOIN FACTURAS_VENTA F ON F.COD_FACTURA = A.COD_FACTURA
    WHERE C.ID_ESTADO = 3)
    
    SELECT * FROM TEMP
    WHERE ${variable} = ${uso} AND ${v} = ${u} AND ${v2} = ${u2}
    ORDER BY FECHA_CONSULTA DESC`

    try {
        const data = await db.sequelize.query(query);
        res.json(data[0]);

    } catch (error) {
        res.send(null);
    }
}

exports.ver_factura_datos = async (req, res) => {
    const id_cita = req.query.id_cita;

    const query = `SELECT
                        B.NUMERO_FACTURA,
                        B.ID_FACTURA_PDF,
                        B.COD_FACTURA
                    FROM CITAS A
                    INNER JOIN FACTURAS_VENTA B ON B.COD_FACTURA = A.COD_FACTURA
                    WHERE A.ID_CITA = ${id_cita}`

    try {
        const data = await db.sequelize.query(query);
        res.json(data[0][0]);

    } catch (error) {
        res.json(error);
    }
}

exports.anular_factura = async (req, res) => {
    const query = `SELECT ANULAR_FACTURA(${req.query.id_factura})`

    try {
        const data = await db.sequelize.query(query);
        res.json({id: data[0][0].anular_factura});

    } catch (error) {
        res.json({id: 0});
    }
}


exports.obtener_timbrado = async (req, res) => {
    const query = `SELECT ID 
                   FROM TIMBRADOS
                   WHERE STATUS = 'A' AND ULT_NRO_EMITIDO < NRO_HASTA
                   ORDER BY FECHA_CREACION
                   LIMIT 1`

    try {
        const data = await db.sequelize.query(query);
        res.json(data[0][0]);

    } catch (error) {
        res.json({id: null});
    }
}

function generar_id(){
    /*const id = generator.generate({
        length: 20,
        numbers: true,
    });

    return id*/

    return uuidv4();
}

exports.generar_pdf_get = async (req, res) => {
    let obj = {
        titulo_pdf: 'dlfjgnwopdwqpq5sds',
        contribuyente: 'Clínica Vitalmente SRL',
        ruc_contribuyente: '9855852-6',
        tel_contribuyente: '021022000',
        ubi_contribuyente: 'Asunción',
        email_contribuyente: 'factura@vitalmente.com.py',
        timbrado: 10007896,
        inicio: '01/05/2023',
        nro_factura: '005-001-1478596',
        emision: '08/05/2023 22:06',
        condicion: 'Contado - Efectivo',
        razon: 'Lucas Filipo Ruiz Fernandez',
        doc: '14755644-1 (RUC)',
        dir: 'Av. Lillio 155 entre Manduvira y Quito',
        total_factura: 1478000,
        iva: 134363.64
    }

    await generar_pdf(obj)
    res.json({msg: 0}) 
}


async function cabecera_factura (id){
    const query = `SELECT * FROM DATOS_FACTURA_CABECERA WHERE COD_FACTURA = ${id}`

    try {
        const data = await db.sequelize.query(query);
        //res.json(data[0]);
        return data[0]

    } catch (error) {
        return null
        //res.send(null);
    }
}

async function detalle_factura (id){
    const query = `SELECT * FROM DATOS_FACTURA_DETALLE WHERE COD_FACTURA = ${id}`

    try {
        const data = await db.sequelize.query(query);
        return data[0]
        //res.json(data[0]);

    } catch (error) {
        return null
    }
}

async function detalle_pago (id){
    const query = `SELECT 
                    CASE FORMA_PAGO
                        WHEN 'EF' THEN 'Efectivo'
                        WHEN 'TC' THEN 'Tarjeta de Crédito'
                        WHEN 'TD' THEN 'Tarjeta de Débito'
                        WHEN 'TR' THEN 'Transferencia bancaria'
                        WHEN 'BI' THEN 'Billetera Electrónica'
                        ELSE 'Otros'
                    END FORMA,
                    MONTO
                FROM DETALLES_PAGO WHERE COD_FACTURA = ${id}`

    try {
        const data = await db.sequelize.query(query);
        return data[0]
        //res.json(data[0]);

    } catch (error) {
        return null
    }
}

async function generar_pdf(factura, detalles, encriptado, cod_fac){
    /* */
    let pagos_metodos = await detalle_pago(cod_fac);
    
    let items_pagos = [
        [
            {text: 'Método de Pago', style: 'tableHeader'},
            {text: 'Cantidad', style: 'tableHeader'}
        ],
    ]

    for (let i = 0; i < pagos_metodos.length; i++) {
        items_pagos.push([pagos_metodos[i].forma, pagos_metodos[i].monto])
    }

    let items = [
        [
            {text: 'Código Item', style: 'tableHeader', rowSpan: 2, alignment: 'left'}, 
            {text: 'Descripción', style: 'tableHeader', rowSpan: 2, alignment: 'left'}, 
            {text: 'Cantidad', style: 'tableHeader', rowSpan: 2, alignment: 'left'}, 
            {text: 'Precio Unitario', style: 'tableHeader', rowSpan: 2,alignment: 'left'},
            {text: 'VALOR DE VENTA', style: 'tableHeader', rowSpan: 1, colSpan: 3, alignment: 'center'},
            {},
            {},
        ],
        [
            {},
            {},
            {},
            {},
            {text: 'Exentas', style: 'tableHeader', alignment: 'center'},
            {text: '5%', style: 'tableHeader', alignment: 'center'},
            {text: '10%', style: 'tableHeader', alignment: 'center'},
        ],
    ]
    /* */

    for (let i = 0; i < detalles.length; i++) {
        items.push([detalles[i].id_item , detalles[i].descripcion, detalles[i].cantidad, +detalles[i].precio, 0, 0, +detalles[i].total])
    }

    let logo = path.join(__dirname, `../assets/img/logo1.png`)

    let fonts = {
        Roboto: {
          normal: path.join(__dirname, `../assets/fonts/normal.ttf`),
          bold: path.join(__dirname, `../assets/fonts/bold.ttf`),
          italics: path.join(__dirname, `../assets/fonts/italic.ttf`),
          bolditalics: path.join(__dirname, `../assets/fonts/bolditalic.ttf`)
        }
     }

    let printer = new PdfPrinter(fonts);

    let contenido = {
        pageSize: 'A4',

        /*background: function(currentPage, pageSize) {
            return {
                    image: logo, 
                    width: 500, 
                    absolutePosition: {x: 50, y: 50},
                    opacity: 0.09}
        },*/

        content: [
            {
                image: logo,
                width: 30,
                height: 30,
                alignment: 'center'
            },
            {
                text: `\n${factura.contribuyente}\n\n`,
                style: 'header',
                alignment: 'center',
                bold: true
            },
            {
                style: 'tableExample',
                table: {
                    widths: [300, 200],
                    body: [
                        [
                            {
                                stack: [
                                    {
                                        text: [{text: 'RUC: ', bold: true, alignment : 'left'}, {text: factura.ruc_contribuyente+'\n', bold: false, alignment : 'left'}]
                                    },
                                    {
                                        text: [{text: 'Ubicación: ', bold: true, alignment : 'left'}, {text: factura.ubi_contribuyente+'\n', bold: false, alignment : 'left'}]
                                    },
                                    {
                                        text: [{text: 'Teléfono: ', bold: true, alignment : 'left'}, {text: factura.tel_contribuyente+'\n', bold: false, alignment : 'left'}]
                                    },
                                    {
                                        text: [{text: 'Email: ', bold: true, alignment : 'left'}, {text: factura.email_contribuyente+'\n', bold: false, alignment : 'left'}]
                                    },
                                    {
                                        text: [{text: 'Actividad: ', bold: true, alignment : 'left'}, {text: 'OTRAS ACTIVIDADES RELACIONADAS CON LA SALUD HUMANA\n', bold: false, alignment : 'left'}]
                                    }
                                ]
                            },
                            {
                                stack: [
                                    {
                                        text: [{text: 'Timbrado Nro.: ', bold: true, alignment : 'left'}, {text: factura.timbrado+'\n', bold: false, alignment : 'left'}]
                                    },
                                    {
                                        text: [{text: 'Fecha inicio vigencia: ', bold: true, alignment : 'left'}, {text: factura.inicio+'\n', bold: false, alignment : 'left'}]
                                    },
                                    {
                                        text: [{text: 'Fecha fin vigencia: ', bold: true, alignment : 'left'}, {text: factura.fin+'\n', bold: false, alignment : 'left'}]
                                    },
                                    {
                                        text: [{text: 'Factura Digital: ', bold: true, alignment : 'left'}, {text: factura.nro_factura+'\n', bold: false, alignment : 'left'}]
                                    }
                                ]
                            }
                        ]
                    ]
                },
                layout: 'noBorders'
            },
            {
                style: 'tableExample2',
                table: {
                    widths: [150,150,150],
                    body: [
                        ['FECHA EMISIÓN', 'CONDICIÓN DE VENTA', 'MONEDA'],
                        [factura.emision, 'Contado', 'Guaraní'],
                    ]
                },
                layout: {
                    fillColor: function (rowIndex, node, columnIndex) {
                        return (rowIndex === 0) ? '#7cd175' : null;
                    }
                }
            },
            {
                style: 'tableExample2',
                table: {
                    widths: [100,'auto','auto'],
                    body: [
                        [
                            {text: 'DATOS DEL RECEPTOR', style: 'tableHeader', colSpan: 3, alignment: 'left'}, 
                            {}, 
                            {}
                        ],
                        [
                            {text: 'Nombre o razón social:', style: 'tableHeader', colSpan: 1, alignment: 'left', border: [true, true, false, false],}, 
                            {text: factura.razon.split(' ').filter((item) => item.length !== 0).join(' '), style: 'tableHeader', colSpan: 2, alignment: 'left', border: [false, true, true, false],}, 
                            {}
                        ],
                        [
                            {text: 'Nro. documento:', style: 'tableHeader', colSpan: 1, alignment: 'left', border: [true, false, false, false]}, 
                            {text: factura.doc, style: 'tableHeader', colSpan: 2, alignment: 'left', border: [false, false, true, false]}, 
                            {}
                        ],
                        [
                            {text: 'Dirección', style: 'tableHeader', colSpan: 1, alignment: 'left', border: [true, false, false, true]}, 
                            {text: factura.dir, style: 'tableHeader', colSpan: 2, alignment: 'left', border: [false, false, true, true]}, 
                            {}
                        ],
                    ]
                },
                layout: {
                    fillColor: function (rowIndex, node, columnIndex) {
                        return (rowIndex === 0) ? '#7cd175' : null;
                    }
                }
            },
            {
                style: 'tableExample2',
                table: {
                    //headerRows: 2,
                    widths: [50,150,'auto',70,40,40,40],
                    body: items
                },
                layout: {
                    fillColor: function (rowIndex, node, columnIndex) {
                        return (rowIndex === 0 || rowIndex === 1) ? '#7cd175' : null;
                    }
                }
                //layout: 'headerLineOnly'
            },

            {
                style: 'tableExample4',
                table: {
                    //headerRows: 2,
                    widths: [105, 50],
                    body: items_pagos
                },
                layout: {
                    fillColor: function (rowIndex, node, columnIndex) {
                        return (rowIndex === 0) ? '#7cd175' : null;
                    }
                }
            },

            {
                style: 'tableExample3',
                table: {
                    //headerRows: 2,
                    widths: [50,150,35,70,40,40,40],
                    /*body: [
                        [{qr: encriptado, fit: '50', version: 2, eccLevel: 'M', rowSpan: 3},{text: 'SUBTOTAL', colSpan: 3},{},{},{text: 0},{text: 0},{text: factura.total_factura}],
                        [{},{text: 'TOTAL A PAGAR:', colSpan: 5},{},{},{},{},{text: factura.total_factura}],
                        [{},{text: 'LIQUIDACION DEL IVA: (5%) 0', border: [true, true, false, true]},{text: '', border: [false, true, false, true]},{text: '(10%) ' + factura.iva, colSpan: 2, border: [false, true, false, true]},{},{text: 'TOTAL IVA: ' + factura.iva, colSpan: 2, border: [false, true, true, true]},{}]
                    ]*/
                    body: [
                        [{text: 'SUBTOTAL', colSpan: 4},{},{},{},{text: 0},{text: 0},{text: factura.total_factura}],
                        [{text: 'TOTAL A PAGAR:', colSpan: 6},{},{},{},{},{},{text: factura.total_factura}],
                        [{text: 'LIQUIDACION DEL IVA: (5%) 0', border: [true, true, false, true], colSpan: 2},{text: '', border: [false, true, false, true]},{text: '(10%) ' + factura.iva, colSpan: 2, border: [false, true, false, true]},{text: '', border: [false, true, false, true]},{text: 'TOTAL IVA: ' + factura.iva, colSpan: 3, border: [false, true, true, true]},{},{}],
                        /*[{
                            text: [
                                {text: 'Código del verificación: ', bold: true, italics: true, fontSize: 9, style: 'texto_style'},
                                {text: encriptado, fontSize: 8},
                            ],
                            colSpan: 7,
                            border: [false, true, false, false]
                        },
                        {},
                        {},
                        {},
                        {},
                        {},
                        {}
                        ]*/
                    ]
                },
            }
        ],
        styles: {
            tableExample: {
                margin: [25, 0, 40, 10],
                fontSize: 9,
            },
            tableExample2: {
                margin: [25, 5, 40, 10],
                fontSize: 9,
            },
            tableExample3: {
                margin: [25, 10, 20, 10],
                fontSize: 9,
            },
            tableExample4: {
                margin: [25, 5, 20, 10],
                fontSize: 9,
            },
            texto_style: {
                margin: [25, 0 , 0, 0]
            }
        },
    }

    let ubi = path.join(__dirname, `../assets/facturas/`)

    let pdfDoc = printer.createPdfKitDocument(contenido, {});
    pdfDoc.pipe(fs.createWriteStream(ubi + encriptado + '.pdf'));
    pdfDoc.end();
}


exports.reg_forma_pago = async (req, res) => {
    const cod_factura = req.body.cod_factura;
    const forma_pago = req.body.forma_pago;
    const monto = req.body.monto;
    const marca = req.body.marca;
    const nro_tar = req.body.nro_tar;
    const cod_referencia = req.body.cod_referencia;
    const nro_cuenta = req.body.nro_cuenta;
    const nro_telefono = req.body.nro_telefono;

    const efectivo = `INSERT INTO DETALLES_PAGO(COD_FACTURA, FORMA_PAGO, MONTO)
                            VALUES(${cod_factura}, '${forma_pago}', ${monto})`;

    const tarjetas = `INSERT INTO DETALLES_PAGO(COD_FACTURA, FORMA_PAGO, MONTO, MARCA_TARJETA, NUMERO_TARJETA, COD_REFERENCIA)
                    VALUES(${cod_factura}, '${forma_pago}', ${monto}, '${marca}', '${nro_tar}', '${cod_referencia}')`;
                    
    const transferencia = `INSERT INTO DETALLES_PAGO(COD_FACTURA, FORMA_PAGO, MONTO, MARCA_TARJETA, NRO_CUENTA, COD_REFERENCIA)
                           VALUES(${cod_factura}, '${forma_pago}', ${monto}, '${marca}', '${nro_cuenta}', '${cod_referencia}')`

    const billetera = `INSERT INTO DETALLES_PAGO(COD_FACTURA, FORMA_PAGO, MONTO, MARCA_TARJETA, NRO_TELEFONO, COD_REFERENCIA)
                       VALUES(${cod_factura}, '${forma_pago}', ${monto}, '${marca}', '${nro_telefono}', '${cod_referencia}');`

    if(forma_pago === 'EF') {
        res.json(await reg_mov_bd(efectivo))

    } else if (forma_pago === 'TC' || forma_pago === 'TD') {
        res.json(await reg_mov_bd(tarjetas))

    } else if (forma_pago === 'TR') {
        res.json(await reg_mov_bd(transferencia))

    } else if (forma_pago === 'BI') {
        res.json(await reg_mov_bd(billetera))

    } else {
        res.json({id: 1, msg: 'Hubo un error inesperado'})
    }
}

async function reg_mov_bd(query) {
    try {
        await db.sequelize.query(query);
        return {id: 0, msg: 'ok'};

    } catch (error) {
        return {id: 1, msg: error};
    }
}