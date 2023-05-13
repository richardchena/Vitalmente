
DROP VIEW IF EXISTS DATOS_FACTURA_CABECERA;
CREATE OR REPLACE VIEW DATOS_FACTURA_CABECERA AS (
	WITH TABLA_PERSONAS AS (
		SELECT
		P.ID_PERSONA AS ID,
		INITCAP(P.PRIMER_NOMBRE || ' ' || COALESCE(P.SEGUNDO_NOMBRE, '') || ' ' || COALESCE(P.TERCER_NOMBRE, '')  || ' ' || P.PRIMER_APELLIDO || ' ' || COALESCE(P.SEGUNDO_APELLIDO, '')) RAZON,
		P.NRO_DOC || ' (' || T.DESCRIPCION || ')' AS DOC,
		P.DIRECCION AS DIR
		FROM PERSONAS P
		INNER JOIN TIPOS_DOCUMENTO T ON T.ID = P.TIPO_DOC
	), 

	TABLA_CLIENTES AS (
		SELECT
		P.ID,
		INITCAP(P.PRIMER_NOMBRE || ' ' || COALESCE(P.SEGUNDO_NOMBRE, '') || ' ' || COALESCE(P.TERCER_NOMBRE, '')  || ' ' || P.PRIMER_APELLIDO || ' ' || COALESCE(P.SEGUNDO_APELLIDO, '')) RAZON,
		P.NRO_DOC || ' (' || T.DESCRIPCION || ')' AS DOC,
		P.DIRECCION AS DIR
		FROM CLIENTE_FACTURA P
		INNER JOIN TIPOS_DOCUMENTO T ON T.ID = P.TIPO_DOC
	)

	SELECT
	A.COD_FACTURA,
	C.ALIAS AS CONTRIBUYENTE,
	C.RUC AS RUC_CONTRIBUYENTE,
	C.TELEFONO AS TEL_CONTRIBUYENTE,
	C.EMAIL AS EMAIL_CONTRIBUYENTE,
	C.DIRECCION AS UBI_CONTRIBUYENTE,
	B.NRO_TIMBRADO AS TIMBRADO,
	TO_CHAR(B.FECHA_DESDE, 'DD/MM/YYYY') AS INICIO,
	TO_CHAR(B.FECHA_HASTA, 'DD/MM/YYYY') AS FIN,
	A.NUMERO_FACTURA AS NRO_FACTURA,
	TO_CHAR(A.FECHA_EMISION, 'DD/MM/YYY HH24:MI:SS') AS EMISION,
	'Contado - Efectivo' AS CONDICION,
	CASE 
		WHEN A.PERSONA_CLIENTE IS NULL THEN E.DOC
		ELSE D.DOC
	END AS DOC,
	CASE 
		WHEN A.PERSONA_CLIENTE IS NULL THEN E.RAZON
		ELSE D.RAZON
	END AS RAZON,
	CASE 
		WHEN A.PERSONA_CLIENTE IS NULL THEN E.DIR
		ELSE D.DIR
	END AS DIR,
	A.TOTAL AS TOTAL_FACTURA,
	A.MONTO_IVA AS IVA
	FROM FACTURAS_VENTA A
	INNER JOIN TIMBRADOS B ON B.ID = A.ID_TIMBRADO
	INNER JOIN CONTRIBUYENTES C ON C.ID = B.CONTRIBUYENTE
	LEFT JOIN TABLA_PERSONAS D ON D.ID = A.PERSONA_CLIENTE
	LEFT JOIN TABLA_CLIENTES E ON E.ID = A.PERSONA_NO_CLIENTE
);

SELECT * FROM DATOS_FACTURA_CABECERA;

SELECT * FROM DATOS_FACTURA_CABECERA WHERE COD_FACTURA = 1
