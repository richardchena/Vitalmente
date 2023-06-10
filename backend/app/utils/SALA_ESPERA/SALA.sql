DROP TABLE IF EXISTS SALA_ESPERA;
DROP TABLE IF EXISTS ESTADOS_SALA_ESPERA;

CREATE TABLE ESTADOS_SALA_ESPERA (
	ID SERIAL PRIMARY KEY,
	DESCRIPCION VARCHAR(50) NOT NULL
);

INSERT INTO ESTADOS_SALA_ESPERA(DESCRIPCION)
VALUES('ESPERANDO');

INSERT INTO ESTADOS_SALA_ESPERA(DESCRIPCION)
VALUES('SIENDO ATENDIDO');

INSERT INTO ESTADOS_SALA_ESPERA(DESCRIPCION)
VALUES('FINALIZADO');

CREATE TABLE SALA_ESPERA (
	ID SERIAL PRIMARY KEY,
	ID_CITA INTEGER REFERENCES CITAS(ID_CITA) NOT NULL,
	ID_ESTADO INTEGER REFERENCES ESTADOS_SALA_ESPERA(ID) DEFAULT 1,
	FECHA_LLEGADA TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FECHA_ATENDIMIENTO TIMESTAMP NULL,
	FECHA_FINALIZACION TIMESTAMP NULL
);


/*PRUEBA DE FUNCIONAMIENDO DE LA SALA*/
/*INSERT INTO CITAS(ID_PACIENTE, ID_PROFESIONAL, ID_TURNO, ID_ESPECIALIDAD, FECHA, HORA)
VALUES(21, 13, 2, 1, '18/04/2023', '20:00');

INSERT INTO CITAS(ID_PACIENTE, ID_PROFESIONAL, ID_TURNO, ID_ESPECIALIDAD, FECHA, HORA)
VALUES(27, 13, 2, 1, '18/04/2023', '20:30');
*/

DROP VIEW IF EXISTS LISTA_RESERVAS_CITAS_DIA;
CREATE OR REPLACE VIEW LISTA_RESERVAS_CITAS_DIA AS (
SELECT
	A.ID_CITA,
	A.ID_PACIENTE AS NRO_EXP,
	A.ID_PROFESIONAL,
	INITCAP(C.PRIMER_NOMBRE || ' ' || C.PRIMER_APELLIDO) AS PACIENTE,
	D.DESCRIPCION AS TIPO_DOC,
	C.NRO_DOC,
	INITCAP(F.PRIMER_NOMBRE || ' ' || F.PRIMER_APELLIDO) AS PROFESIONAL,
	G.DESCRIPCION AS ESPECIALIDAD,
	TO_CHAR(A.HORA, 'HH24:MI') AS HORARIO --,
	--CONCAT(A.FECHA, ' ', A.HORA)::TIMESTAMP , NOW() - INTERVAL '2 hour'
FROM CITAS A
INNER JOIN PACIENTES B ON B.ID_PACIENTE = A.ID_PACIENTE
INNER JOIN PERSONAS C ON C.ID_PERSONA = B.ID_PERSONA
INNER JOIN TIPOS_DOCUMENTO D ON D.ID = C.TIPO_DOC
INNER JOIN PROFESIONALES E ON E.ID_PROFESIONAL = A.ID_PROFESIONAL
INNER JOIN PERSONAS F ON F.ID_PERSONA = E.ID_PERSONA
INNER JOIN ESPECIALIDADES G ON G.ID_ESPECIALIDAD = A.ID_ESPECIALIDAD
WHERE A.ID_CITA NOT IN (SELECT DISTINCT ID_CITA FROM SALA_ESPERA) AND A.FECHA = CURRENT_DATE AND A.ESTADO = 1 AND CONCAT(A.FECHA, ' ', A.HORA)::TIMESTAMP >= NOW() - INTERVAL '2 hour'
ORDER BY A.ID_PROFESIONAL, A.HORA);