DROP VIEW IF EXISTS MOVIMIENTOS_REGISTRADOS;
CREATE OR REPLACE VIEW MOVIMIENTOS_REGISTRADOS AS (
	SELECT
		M.ID,
		TO_CHAR(M.FECHA_CREACION, 'DD/MM/YYYY HH24:MI:SS') AS FECHA,
		M.FECHA_CREACION::DATE AS FECHA_FILTRO,
		TM.ID AS ID_TIPO_MOV,
		TM.DESCRIPCION AS TIPO,
		M.TIPO AS ID_TIPO,
		CASE UPPER(MEDIO_PAGO)
			WHEN 'EF' THEN 'Efectivo'
			ELSE 'Cuenta Banco'
		END AS FORMA,
		CM.DESCRIPCION AS CONCEPTO,
		CM.ID AS ID_CAT,
		M.MONTO AS IMPORTE,
		M.NRO_FACTURA,
		M.COMENTARIO
	FROM MOVIMIENTOS M
	INNER JOIN TIPO_MOVIMIENTO TM ON TM.ID = M.TIPO
	INNER JOIN CATEGORIA_MOVIMIENTO CM ON CM.ID = M.CATEGORIA
	WHERE M.ESTADO = 'V'
);

SELECT * FROM MOVIMIENTOS_REGISTRADOS;
