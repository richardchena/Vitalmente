
DROP FUNCTION IF EXISTS MODIFICAR_PACIENTE (PACIENTES.ID_PACIENTE%TYPE,
											USERS.EMAIL%TYPE,
											USERS.TELEFONO%TYPE,
											PERSONAS.PRIMER_NOMBRE%TYPE,
											PERSONAS.SEGUNDO_NOMBRE%TYPE,
											PERSONAS.TERCER_NOMBRE%TYPE,
											PERSONAS.PRIMER_APELLIDO%TYPE,
											PERSONAS.SEGUNDO_APELLIDO%TYPE,
											PERSONAS.FECHA_NACIMIENTO%TYPE,
											PERSONAS.NACIONALIDAD%TYPE,
											PERSONAS.LUGAR_NACIMIENTO%TYPE,
											PERSONAS.ESTADO_CIVIL%TYPE,
											PERSONAS.GENERO%TYPE,
											PERSONAS.NRO_DOC%TYPE,								   
											PACIENTES.OCUPACION%TYPE,
										    PERSONAS.DIRECCION%TYPE,
										    PERSONAS.LUGAR_RESIDENCIA%TYPE,
										    PERSONAS.TIPO_DOC%TYPE);
	
CREATE OR REPLACE FUNCTION MODIFICAR_PACIENTE (
	ID_PAC PACIENTES.ID_PACIENTE%TYPE,
	CORREO USERS.EMAIL%TYPE,
	TELF USERS.TELEFONO%TYPE,

	NOM1 PERSONAS.PRIMER_NOMBRE%TYPE,
	NOM2 PERSONAS.SEGUNDO_NOMBRE%TYPE,
	NOM3 PERSONAS.TERCER_NOMBRE%TYPE,
	APE1 PERSONAS.PRIMER_APELLIDO%TYPE,
	APE2 PERSONAS.SEGUNDO_APELLIDO%TYPE,
	FNAC PERSONAS.FECHA_NACIMIENTO%TYPE,
	NAC PERSONAS.NACIONALIDAD%TYPE,
	LNAC PERSONAS.LUGAR_NACIMIENTO%TYPE,
	EC PERSONAS.ESTADO_CIVIL%TYPE,
	G PERSONAS.GENERO%TYPE,
	NDOC PERSONAS.NRO_DOC%TYPE,
	
	OCU PACIENTES.OCUPACION%TYPE,
	
	--EXTRAS
	DIR PERSONAS.DIRECCION%TYPE,
	LRES PERSONAS.LUGAR_RESIDENCIA%TYPE,
	TDOC PERSONAS.TIPO_DOC%TYPE
	
)
RETURNS VARCHAR
LANGUAGE plpgsql
AS $$
DECLARE 
	RESP RESPUESTA%ROWTYPE;
	ID_USER USERS.ID%TYPE;
	ID_PERS PERSONAS.ID_PERSONA%TYPE;
BEGIN

	SELECT ID_USUARIO, ID_PERSONA INTO ID_USER, ID_PERS
	FROM PACIENTES
	WHERE ID_PACIENTE = ID_PAC;
	
	IF (ID_USER IS NULL OR ID_PERS IS NULL) THEN
		RETURN 'El paciente no existe';
	END IF;
	
	UPDATE PACIENTES
	SET OCUPACION = OCU
	WHERE ID_PACIENTE = ID_PAC;
	
	UPDATE USERS
	SET EMAIL = CORREO, TELEFONO = TELF
	WHERE ID = ID_USER;
	
	UPDATE PERSONAS
	SET PRIMER_NOMBRE = NOM1, 
		SEGUNDO_NOMBRE = NOM2, 
		TERCER_NOMBRE = NOM3, 
		PRIMER_APELLIDO = APE1, 
		SEGUNDO_APELLIDO = APE2, 
		FECHA_NACIMIENTO = FNAC, 
		NACIONALIDAD = NAC,
		LUGAR_NACIMIENTO = LNAC,
		ESTADO_CIVIL = EC,
		GENERO = G,
		NRO_DOC = NDOC,
		DIRECCION = DIR,
		LUGAR_RESIDENCIA = LRES,
		TIPO_DOC = TDOC
		
	WHERE ID_PERSONA = ID_PERS;
	
    --USUARIO REGISTRADO!
	RETURN '¡Usuario modificado correctamente!';

EXCEPTION
	WHEN OTHERS THEN
		RETURN 'Error: ' || SQLERRM;
END;
$$;

--SELECT MODIFICAR_PACIENTE(48585, 'richard_chena@hotmail.com', '0974-968-877', 'MIRENA', 'VANESSA', 'SONIA', 'JABER', 'PIFED', '1986-07-04', 139, 910, 'C', 'F', '3688445', 'ESCRIBANA');
