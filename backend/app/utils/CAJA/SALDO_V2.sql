DROP FUNCTION IF EXISTS OBTENER_SALDO_V2(INTEGER);

CREATE OR REPLACE FUNCTION OBTENER_SALDO_V2 (
	OPC INTEGER --0: TODOS LOS TIPOS; 1: EFECTIVO; 2: CUENTA
)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE 
	SALDO INTEGER;
BEGIN
	IF( OPC = 0) THEN
		WITH INGRESO AS (
			SELECT 
				1 AS COD, SUM(MONTO) AS INGRESO
			FROM MOVIMIENTOS
			WHERE ESTADO = 'V' AND TIPO = 1
		),

		EGRESO AS (
			SELECT 
				1 AS COD, SUM(MONTO) AS EGRESO
			FROM MOVIMIENTOS
			WHERE ESTADO = 'V' AND TIPO = 2
		)

		SELECT COALESCE(B.INGRESO, 0) -  COALESCE(A.EGRESO, 0) AS SALDO INTO SALDO
		FROM EGRESO A
		INNER JOIN INGRESO B ON B.COD = A.COD;
		
	ELSIF (OPC = 1) THEN 
		WITH INGRESO AS (
			SELECT 
				1 AS COD, SUM(MONTO) AS INGRESO
			FROM MOVIMIENTOS
			WHERE ESTADO = 'V' AND TIPO = 1 AND MEDIO_PAGO = 'EF'
		),

		EGRESO AS (
			SELECT 
				1 AS COD, SUM(MONTO) AS EGRESO
			FROM MOVIMIENTOS
			WHERE ESTADO = 'V' AND TIPO = 2 AND MEDIO_PAGO = 'EF'
		)

		SELECT COALESCE(B.INGRESO, 0) -  COALESCE(A.EGRESO, 0) AS SALDO INTO SALDO
		FROM EGRESO A
		INNER JOIN INGRESO B ON B.COD = A.COD;
		
	ELSIF (OPC = 2 ) THEN 
		WITH INGRESO AS (
			SELECT 
				1 AS COD, SUM(MONTO) AS INGRESO
			FROM MOVIMIENTOS
			WHERE ESTADO = 'V' AND TIPO = 1 AND MEDIO_PAGO = 'CU'
		),

		EGRESO AS (
			SELECT 
				1 AS COD, SUM(MONTO) AS EGRESO
			FROM MOVIMIENTOS
			WHERE ESTADO = 'V' AND TIPO = 2 AND MEDIO_PAGO = 'CU'
		)

		SELECT COALESCE(B.INGRESO, 0) -  COALESCE(A.EGRESO, 0) AS SALDO INTO SALDO
		FROM EGRESO A
		INNER JOIN INGRESO B ON B.COD = A.COD;
	
	ELSE
		SALDO := 0;
		
	END IF;
	
	RETURN SALDO;
	
END;
$$;

SELECT OBTENER_SALDO_V2(2);
SELECT * FROM MOVIMIENTOS
