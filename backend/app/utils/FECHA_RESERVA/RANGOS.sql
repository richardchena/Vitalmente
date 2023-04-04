CREATE OR REPLACE FUNCTION RANGO_DIAS (FEC_INI TIMESTAMP,
									   FEC_FIN TIMESTAMP,
									   HOR_INI TIME,
									   HOR_FIN TIME,
									   ID_DIA INTEGER)
RETURNS TABLE (FECHA TIMESTAMP)
LANGUAGE plpgsql
AS $$
DECLARE
	diff INTEGER;
	dias VARCHAR(50);
	fecha TIMESTAMP;
	int_30 INTEGER;
BEGIN
	DROP TABLE IF EXISTS TABLA_TEMPORAL;
	CREATE TEMPORARY TABLE TABLA_TEMPORAL (
		FECHA TIMESTAMP
	);

	int_30 := ABS(EXTRACT(EPOCH FROM ( HOR_FIN - HOR_INI))/60)/30;
	diff := EXTRACT(DAYS FROM FEC_FIN - FEC_INI);
	for cnt in 0..diff loop
		dias := concat(cast(cnt as varchar), ' days'); 
		fecha := FEC_INI + HOR_INI + CAST(dias as interval);
		for hrs in 0..int_30 loop
			IF EXTRACT(dow from fecha) = ID_DIA THEN
				INSERT INTO TABLA_TEMPORAL VALUES(fecha);
				fecha := fecha + cast('30 minutes' as interval);
			END IF;
		end loop;
	end loop;
	
	RETURN QUERY
		SELECT A.*
		FROM TABLA_TEMPORAL A
		WHERE CAST(A.FECHA AS DATE) NOT IN (SELECT DISTINCT MAKE_DATE(ANHO, MES, DIA) FROM FERIADOS);
END; $$

SELECT RANGO_DIAS('2023-04-01', '2023-04-15', '14:00:00', '15:30:00', 4);

/*set lc_time = 'de_DE';
select to_char(date '2023-04-01', 'TMDay') ;*/