DROP VIEW IF EXISTS LISTA_PROFESIONALES;

CREATE OR REPLACE VIEW LISTA_PROFESIONALES AS
	SELECT 
		A.ID_PROFESIONAL AS ID,
		B.PRIMER_NOMBRE || ' ' || B.PRIMER_APELLIDO AS NAME,
		B.NRO_DOC,
		A.REGISTRO,
		CAST (EXTRACT (YEAR FROM AGE(CURRENT_DATE, B.FECHA_NACIMIENTO)) AS INTEGER) AS EDAD,
		CASE UPPER(GENERO)
			WHEN 'M' THEN 'Masculino'
			WHEN 'F' THEN 'Femenino'
			WHEN 'P' THEN 'Prefiero no decirlo'
			ELSE
				'Otro'
		END AS GENERO,
		C.EMAIL,
		C.TELEFONO,
		CASE C.STATUS
			WHEN 'A' THEN 'Activa'
			WHEN 'B' THEN 'Baja'
			WHEN 'I' THEN 'Inactiva'
			ELSE
				'Desconocido'
		END AS STATUS
	FROM PROFESIONALES A
	INNER JOIN PERSONAS B ON B.ID_PERSONA = A.ID_PERSONA
	INNER JOIN USERS C ON C.ID = A.ID_USUARIO
	WHERE C.ROLE = 2 AND C.STATUS <> 'B';

SELECT * FROM LISTA_PROFESIONALES;

