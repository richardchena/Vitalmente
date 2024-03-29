DROP VIEW IF EXISTS LISTA_AGENDAS_PACIENTE;

CREATE VIEW LISTA_AGENDAS_PACIENTE AS 
SELECT
	CI.ID_PROFESIONAL,
	CI.ID_PACIENTE,
	CI.ID_CITA,
	EC.DESCRIPCION AS ESTADO,
	INITCAP(PE.PRIMER_NOMBRE || ' ' || COALESCE(PE.SEGUNDO_NOMBRE, '') || ' ' || COALESCE(PE.TERCER_NOMBRE, '')  || ' ' || PE.PRIMER_APELLIDO || ' ' || COALESCE(PE.SEGUNDO_APELLIDO, '')) PACIENTE,
	TO_CHAR(CI.FECHA_RESERVA, 'dd/mm/yyyy hh24:mi') AS FECHA_RESERVA,
	TO_CHAR(CI.FECHA, 'dd/mm/yyyy') || ' ' || TO_CHAR(CI.HORA, 'hh24:mi') AS FECHA_TURNO,
	ES.DESCRIPCION AS ESPECIALIDAD,
	INITCAP(PE_PRO.PRIMER_NOMBRE || ' ' || COALESCE(PE_PRO.SEGUNDO_NOMBRE, '') || ' ' || COALESCE(PE_PRO.TERCER_NOMBRE, '')  || ' ' || PE_PRO.PRIMER_APELLIDO || ' ' || COALESCE(PE_PRO.SEGUNDO_APELLIDO, '')) PROFESIONAL
FROM CITAS CI
INNER JOIN PACIENTES PA ON PA.ID_PACIENTE = CI.ID_PACIENTE
INNER JOIN PROFESIONALES PR ON PR.ID_PROFESIONAL = CI.ID_PROFESIONAL
INNER JOIN PERSONAS PE ON PE.ID_PERSONA = PA.ID_PERSONA
INNER JOIN PERSONAS PE_PRO ON PE_PRO.ID_PERSONA = PR.ID_PERSONA
INNER JOIN ESPECIALIDADES ES ON ES.ID_ESPECIALIDAD = CI.ID_ESPECIALIDAD
INNER JOIN ESTADOS_CITA EC ON EC.ID = CI.ESTADO
WHERE TO_TIMESTAMP(TO_CHAR(CI.FECHA, 'dd/mm/yyyy') || ' ' || TO_CHAR(CI.HORA, 'hh24:mi'), 'dd/mm/yyyy hh24:mi') >= NOW() AND CI.ESTADO IN (1, 3)
ORDER BY CI.FECHA, CI.HORA;

SELECT * FROM LISTA_AGENDAS_PACIENTE;