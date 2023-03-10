DROP VIEW IF EXISTS CONSULTAS_PACIENTE;

CREATE OR REPLACE VIEW CONSULTAS_PACIENTE AS
	SELECT 
		CO.ID_PACIENTE,
		CO.ID_CONSULTA AS ID,
		TO_CHAR(CO.FECHA_CONSULTA,'DD/MM/YYYY HH24:MI:SS') AS FECHA,
		INITCAP(PE.PRIMER_NOMBRE || ' ' || COALESCE(PE.SEGUNDO_NOMBRE, '') || ' ' || COALESCE(PE.TERCER_NOMBRE, '')  || ' ' || PE.PRIMER_APELLIDO || ' ' || COALESCE(PE.SEGUNDO_APELLIDO, '')) PROFESIONAL,
		ES.DESCRIPCION AS ESPECIALIDAD,
		CO.MOTIVO,
		CO.DIAGNOSTICO_ACTUAL,
		CO.ANTECEDENTE,
		CO.TECNICA_APLICADA
	FROM CONSULTAS CO
	LEFT JOIN PROFESIONALES PR ON PR.ID_PROFESIONAL = CO.ID_PROFESIONAL
	LEFT JOIN PERSONAS PE ON PE.ID_PERSONA = PR.ID_PERSONA
	LEFT JOIN ESPECIALIDADES ES ON ES.ID_ESPECIALIDAD = CO.ID_ESPECIALIDAD
	ORDER BY CO.ID_PACIENTE, CO.FECHA_CONSULTA DESC;
	
SELECT * FROM CONSULTAS_PACIENTE WHERE ID_PACIENTE = 6;