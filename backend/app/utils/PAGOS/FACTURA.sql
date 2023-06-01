
--ALTER TABLE ESPECIALIDADES ADD PORC_IVA NUMERIC(3);
--UPDATE ESPECIALIDADES SET PORC_IVA = 10;

ALTER TABLE CITAS DROP COLUMN COD_FACTURA;

DROP TABLE IF EXISTS DETALLES_PAGO;  
DROP TABLE IF EXISTS EMISORES_TARJETA;
DROP TABLE IF EXISTS DETALLES_FACTURA;
DROP TABLE IF EXISTS FACTURAS_VENTA;

CREATE TABLE FACTURAS_VENTA (
	COD_FACTURA SERIAL PRIMARY KEY,
	FECHA_EMISION TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	NUMERO_FACTURA VARCHAR(20) NOT NULL,
	ID_TIMBRADO INTEGER REFERENCES TIMBRADOS(ID) NOT NULL,
	CONDICION_VENTA VARCHAR(1), --C: CONTADO --SOLO FACTURAS AL CONTADO SON EMITIDAS EN LA ENTIDAD
	MONTO_GRAVADO NUMERIC DEFAULT 0 NOT NULL,
	MONTO_IVA NUMERIC DEFAULT 0 NOT NULL,
	MONTO_EXENTO NUMERIC DEFAULT 0 NOT NULL,
	TOTAL NUMERIC DEFAULT 0 NOT NULL,
	ESTADO VARCHAR(1) DEFAULT 'P' NOT NULL, -- V: VIGENTE, A: ANULADO, P: PENDIENTE
	CODIGO_CITA INTEGER REFERENCES CITAS(ID_CITA) NOT NULL,
	PERSONA_CLIENTE INTEGER REFERENCES PERSONAS(ID_PERSONA) NULL,
	PERSONA_NO_CLIENTE INTEGER REFERENCES CLIENTE_FACTURA(ID) NULL,
	ID_FACTURA_PDF VARCHAR(100) NULL
);

CREATE TABLE DETALLES_FACTURA(
	COD_DETALLE SERIAL PRIMARY KEY,
	COD_FACTURA INTEGER REFERENCES FACTURAS_VENTA(COD_FACTURA) NULL, --SI TIENE ASOCIADO UNA FACTURA ESTA ABONADO
	ID_ITEM INTEGER REFERENCES ESPECIALIDADES(ID_ESPECIALIDAD) NOT NULL,
	CANTIDAD INTEGER NOT NULL,
	APLICAR_COBRO VARCHAR(1) DEFAULT 'S' NOT NULL -- S: SI APLICA COBRO. N: NO APLICA COBRO
);

CREATE TABLE EMISORES_TARJETA (
	ID SERIAL PRIMARY KEY,
	NOMBRE VARCHAR(150) NOT NULL, 
	DIRECCION VARCHAR(200) NOT NULL,
	TELEFONO VARCHAR(15) NOT NULL,
	EMAIL VARCHAR(150) NOT NULL,
	TIPO VARCHAR(2) NOT NULL --BA: BANCO, FI: FINANCIERA, CO:COOPERATIVA Y BI: BILLETERA
);

CREATE TABLE DETALLES_PAGO (
	COD_DET_PAG SERIAL PRIMARY KEY,
	COD_FACTURA INTEGER REFERENCES FACTURAS_VENTA(COD_FACTURA),
	FORMA_PAGO VARCHAR(2) NOT NULL, --EF: EFECTIVO, TC: TARJETA DE CREDITO, TD: TARJETA DE DEBITO, BI: BILLETERA ELECTRONICAS, QR: PAGOS EN QR
	MONTO NUMERIC NOT NULL,
	MARCA_TARJETA VARCHAR(20) NULL,
	NUMERO_TARJETA VARCHAR(20) NULL,
	COD_EMISOR_PAGO_ELECTRONICO INTEGER REFERENCES EMISORES_TARJETA(ID) NULL, 
	NRO_TELEFONO VARCHAR(20) NULL, --CASOS DE PAGOS EN BILLETERA
	COD_REFERENCIA VARCHAR(50) NULL --CODIGO DEL POS
);

ALTER TABLE DETALLES_PAGO ADD NRO_CUENTA VARCHAR(20);
ALTER TABLE CITAS ADD COD_FACTURA INTEGER REFERENCES FACTURAS_VENTA(COD_FACTURA);