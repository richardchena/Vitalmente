DROP VIEW IF EXISTS GET_DATOS_PROFESIONAL_MODIFICAR;

CREATE OR REPLACE VIEW GET_DATOS_PROFESIONAL_MODIFICAR AS
	SELECT
		A.ID_PROFESIONAL,
		B.PRIMER_NOMBRE,
		B.SEGUNDO_NOMBRE,
		B.TERCER_NOMBRE,
		B.PRIMER_APELLIDO,
		B.SEGUNDO_APELLIDO,
		B.FECHA_NACIMIENTO,
		B.NACIONALIDAD,
		B.LUGAR_NACIMIENTO AS CIUDAD_NAC,
		D.ID_DEPARTAMENTO AS DEPARTAMENTO_NAC,
		B.ESTADO_CIVIL,
		B.GENERO,
		B.NRO_DOC,
		A.REGISTRO,
		C.USERNAME,
		C.EMAIL,
		C.TELEFONO,
		B.DIRECCION,
        B.LUGAR_RESIDENCIA,
		E.ID_DEPARTAMENTO AS DEPARTAMENTO_RES,
		B.TIPO_DOC
	FROM PROFESIONALES A
	LEFT JOIN PERSONAS B ON B.ID_PERSONA = A.ID_PERSONA
	LEFT JOIN USERS C ON C.ID = A.ID_USUARIO
	LEFT JOIN CIUDADES D ON D.COD_CONCATENADO = B.LUGAR_NACIMIENTO
	LEFT JOIN CIUDADES E ON E.COD_CONCATENADO = B.LUGAR_RESIDENCIA;;
	
	
SELECT *
FROM GET_DATOS_PROFESIONAL_MODIFICAR
WHERE ID_PROFESIONAL = 2;