CREATE TABLE MESES (
	ID SERIAL PRIMARY KEY,
	DESCRIPCION VARCHAR(15) NOT NULL
)

INSERT INTO MESES (DESCRIPCION)
VALUES ('Enero');

INSERT INTO MESES (DESCRIPCION)
VALUES ('Febrero');

INSERT INTO MESES (DESCRIPCION)
VALUES ('Marzo');

INSERT INTO MESES (DESCRIPCION)
VALUES ('Abril');

INSERT INTO MESES (DESCRIPCION)
VALUES ('Mayo');

INSERT INTO MESES (DESCRIPCION)
VALUES ('Junio');

INSERT INTO MESES (DESCRIPCION)
VALUES ('Julio');

INSERT INTO MESES (DESCRIPCION)
VALUES ('Agosto');

INSERT INTO MESES (DESCRIPCION)
VALUES ('Septiembre');

INSERT INTO MESES (DESCRIPCION)
VALUES ('Octubre');

INSERT INTO MESES (DESCRIPCION)
VALUES ('Noviembre');

INSERT INTO MESES (DESCRIPCION)
VALUES ('Diciembre');

DROP VIEW IF EXISTS LISTA_FECHAS_DISPONIBLES_V2;
CREATE OR REPLACE VIEW LISTA_FECHAS_DISPONIBLES_V2 AS (
	WITH TEMP1 AS (
		SELECT *, 
			   RANGO_DIAS(FECHA_DESDE, FECHA_HASTA, HORA_INICIO, HORA_FIN, ID_DIA) AS FECHA_RANGO 
		FROM LISTA_FECHAS_DISPONIBLES),

	TEMP2 AS (
		SELECT A.*, CHECK_CITA(ID_PROFESIONAL, FECHA_RANGO) AS ESTATUS_RESERVA
		FROM TEMP1 A
	),
	TEMP3 AS (
		SELECT *
		FROM TEMP2 
		WHERE ESTATUS_RESERVA <> 'RESERVADO' AND FECHA_RANGO > CURRENT_TIMESTAMP
	),
	
	TEMP4 AS(
		SELECT
			A.ID_AGENDA,
			B.DESCRIPCION AS DIA,
			A.ESPECIALIDAD,
			A.FECHA_RANGO,
			TO_CHAR(A.FECHA_RANGO::date, 'dd/mm/yyyy') AS FECHA,
			CAST(A.FECHA_RANGO AS TIME) AS HORA,
			A.ID_DIA,
			A.ID_ESPECIALIDAD,
			A.ID_PROFESIONAL,
			A.ID_TURNO,
			A.PROFESIONAL,
			CASE
				WHEN A.ID_TURNO = 1 THEN 'Mañana'
				ELSE 'Tarde'
			END AS TURNO,
			TO_CHAR(A.FECHA_RANGO::date, 'dd/mm/yyyy') || '-' || A.ID_PROFESIONAL AS CLAVE_FILTRO
		FROM TEMP3 A
		LEFT JOIN DIAS B ON B.ID = A.ID_DIA
	)
	
	SELECT * FROM TEMP4
	WHERE CLAVE_FILTRO NOT IN (SELECT TO_CHAR(FECHA_FILTRO, 'dd/mm/yyyy') || '-' || ID_PROFESIONAL FROM RESTRICCION_FECHAS_PROFESIONAL)
 );
 
 
CREATE TABLE RESTRICCION_FECHAS_PROFESIONAL (
	ID SERIAL PRIMARY KEY,
	FECHA_FILTRO DATE NOT NULL,
	ID_PROFESIONAL INTEGER REFERENCES PROFESIONALES(ID_PROFESIONAL) NOT NULL,
	FECHA_CREACION_RESTRICCION TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

SELECT * --, TO_CHAR(FECHA_FILTRO, 'dd/mm/yyyy') || '-' || ID_PROFESIONAL AS CLAVE
FROM RESTRICCION_FECHAS_PROFESIONAL