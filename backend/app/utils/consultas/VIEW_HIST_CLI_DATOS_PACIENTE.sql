DROP VIEW IF EXISTS HISTORIAL_PACIENTE_DATOS_PACIENTE;

CREATE OR REPLACE VIEW HISTORIAL_PACIENTE_DATOS_PACIENTE AS
	SELECT
		PA.ID_PACIENTE,
		INITCAP(PE.PRIMER_NOMBRE || ' ' || COALESCE(PE.SEGUNDO_NOMBRE, '') || ' ' || COALESCE(PE.TERCER_NOMBRE, '')  || ' ' || PE.PRIMER_APELLIDO || ' ' || COALESCE(PE.SEGUNDO_APELLIDO, '')) NOMBRE_COMPLETO,
		CAST (EXTRACT (YEAR FROM AGE(CURRENT_DATE, PE.FECHA_NACIMIENTO)) AS INTEGER) AS EDAD,
		PE.NRO_DOC,
		CASE UPPER(PE.GENERO)
			WHEN 'M' THEN 'Masculino'
			WHEN 'F' THEN 'Femenino'
			WHEN 'P' THEN 'Prefiero no decirlo'
			ELSE
				'OTRO'
		END AS GENERO,
		CASE UPPER(PE.ESTADO_CIVIL)
			WHEN 'S' THEN 'Soltero'
			WHEN 'C' THEN 'Casado'
			WHEN 'V' THEN 'Viudo'
			WHEN 'D' THEN 'Divorsiado'
			WHEN 'M' THEN 'Menor'
			ELSE 'Otro'
		END AS EST_CIV,
		INITCAP(PS.NOMBRE) AS PAIS,
		INITCAP(COALESCE(DE.DESCRIPCION || ' - ' || CI.DESCRIPCION, 'NO ESPECIFICADO')) AS CIUDAD,
		INITCAP(PA.OCUPACION) AS OCUPACION,
		TI.DESCRIPCION AS TIPO_DOC
	FROM PACIENTES PA
	INNER JOIN PERSONAS PE ON PE.ID_PERSONA = PA.ID_PERSONA
	LEFT JOIN PAISES PS ON PS.ID_PAIS = PE.NACIONALIDAD
	LEFT JOIN CIUDADES CI ON CI.COD_CONCATENADO = PE.LUGAR_RESIDENCIA
	LEFT JOIN DEPARTAMENTOS DE ON DE.ID_DEPARTAMENTO = CI.ID_DEPARTAMENTO
	LEFT JOIN TIPOS_DOCUMENTO TI ON TI.ID = PE.TIPO_DOC;

SELECT * FROM HISTORIAL_PACIENTE_DATOS_PACIENTE WHERE ID_PACIENTE = 6;