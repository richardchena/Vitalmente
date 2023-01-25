
--DROP FUNCTION IF EXISTS REGISTRAR_PACIENTE (USERS.USERNAME%TYPE);

DROP FUNCTION IF EXISTS REGISTRAR_PACIENTE (USERS.USERNAME%TYPE,
											USERS.EMAIL%TYPE,
											USERS.PASSWORD%TYPE,
											USERS.ROLE%TYPE,
											PERSONAS.PRIMER_NOMBRE%TYPE,
											PERSONAS.SEGUNDO_NOMBRE%TYPE,
											PERSONAS.TERCER_NOMBRE%TYPE,
											PERSONAS.PRIMER_APELLIDO%TYPE,
											PERSONAS.SEGUNDO_APELLIDO%TYPE,
											PERSONAS.FECHA_NACIMIENTO%TYPE,
											PERSONAS.NACIONALIDAD%TYPE,
											PERSONAS.LUGAR_NACIMIENTO%TYPE,
											PERSONAS.ESTADO_CIVIL%TYPE,
											PERSONAS.NRO_DOC%TYPE,								   
											PACIENTES.OCUPACION%TYPE);
	
DROP TYPE IF EXISTS RESPUESTA;

CREATE TYPE RESPUESTA AS (
 ID SMALLINT,
 MSG VARCHAR(100)
);

CREATE OR REPLACE FUNCTION REGISTRAR_PACIENTE (
	--DATOS DEL USUARIO
	USERNAME USERS.USERNAME%TYPE,
	EMAIL USERS.EMAIL%TYPE,
	PASSWORD USERS.PASSWORD%TYPE,
	ROLE USERS.ROLE%TYPE,
	
	--DATOS DE LA PERSONA
	NOM1 PERSONAS.PRIMER_NOMBRE%TYPE,
	NOM2 PERSONAS.SEGUNDO_NOMBRE%TYPE,
	NOM3 PERSONAS.TERCER_NOMBRE%TYPE,
	APE1 PERSONAS.PRIMER_APELLIDO%TYPE,
	APE2 PERSONAS.SEGUNDO_APELLIDO%TYPE,
	FNAC PERSONAS.FECHA_NACIMIENTO%TYPE,
	NAC PERSONAS.NACIONALIDAD%TYPE,
	LNAC PERSONAS.LUGAR_NACIMIENTO%TYPE,
	EC PERSONAS.ESTADO_CIVIL%TYPE,
	NDOC PERSONAS.NRO_DOC%TYPE,
	
	--DATOS DEL PACIENTE
	OCU PACIENTES.OCUPACION%TYPE
	
)
RETURNS RESPUESTA
LANGUAGE plpgsql
AS $$
DECLARE 
	RESP RESPUESTA%ROWTYPE;
	ID_USUARIO USERS.ID%TYPE;
	ID_PERSONA_NEW PERSONAS.ID_PERSONA%TYPE;
BEGIN

	WITH ROWS AS (
		INSERT INTO USERS(USERNAME, EMAIL, PASSWORD, ROLE) 
		VALUES(LOWER(USERNAME), LOWER(EMAIL), PASSWORD, ROLE) RETURNING ID
	) SELECT ID INTO ID_USUARIO FROM ROWS;
	
	WITH ROWS AS (	
		INSERT INTO PERSONAS(PRIMER_NOMBRE, SEGUNDO_NOMBRE, TERCER_NOMBRE, PRIMER_APELLIDO, SEGUNDO_APELLIDO, FECHA_NACIMIENTO, NACIONALIDAD, LUGAR_NACIMIENTO, ESTADO_CIVIL, NRO_DOC)
		VALUES(UPPER(NOM1), UPPER(NOM2), UPPER(NOM3), UPPER(APE1), UPPER(APE2), FNAC, NAC, LNAC, EC, NDOC) RETURNING ID_PERSONA
	) SELECT ID_PERSONA INTO ID_PERSONA_NEW FROM ROWS;

	INSERT INTO PACIENTES(ID_PERSONA, ID_USUARIO, OCUPACION)
	VALUES (ID_PERSONA_NEW, ID_USUARIO, OCU);
	
    --USUARIO REGISTRADO!
	RESP.ID := 0;
	RESP.MSG := '¡Usuario registrado correctamente!';
	
	RETURN RESP;

EXCEPTION
	WHEN SQLSTATE '23505' THEN
		RESP.ID := 1;
		RESP.MSG := 'Usuario ya registrado';
		RETURN RESP;
		
	WHEN OTHERS THEN
		RESP.ID := 2;
		RESP.MSG := SQLERRM;
		RETURN RESP;
		
END;
$$;

/*
SELECT REGISTRAR_PACIENTE ('damian', 'damian@example.com', 'passw0rd', 3, 'Richard', 'Damian', NULL, 'Cabrera', 'Chena', '1998-02-14', 139, 1104, 'S', '0', 'No Aplica');

SELECT * FROM USERS;
SELECT * FROM PERSONAS;
SELECT * FROM PACIENTES;
*/
