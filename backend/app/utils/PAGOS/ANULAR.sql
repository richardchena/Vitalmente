DROP FUNCTION IF EXISTS ANULAR_FACTURA(INTEGER);

CREATE OR REPLACE FUNCTION ANULAR_FACTURA (ID_FAC INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE

BEGIN
	UPDATE FACTURAS_VENTA
	SET ESTADO = 'A' --ANULADO
	WHERE COD_FACTURA = ID_FAC;
	
	UPDATE CITAS
	SET COD_FACTURA = NULL
	WHERE COD_FACTURA = ID_FAC;
	
	UPDATE MOVIMIENTOS
	SET ESTADO = 'A'
	WHERE COD_FACTURA = ID_FAC;
	
	RETURN 1;
EXCEPTION
	WHEN OTHERS THEN 
		RETURN 0;
END;
$$;

select anular_factura(1);