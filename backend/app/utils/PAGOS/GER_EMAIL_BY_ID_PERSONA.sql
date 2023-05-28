DROP FUNCTION CAMBIAR_MAIL (INTEGER, VARCHAR);
CREATE OR REPLACE FUNCTION CAMBIAR_MAIL (ID_P INTEGER, CORREO VARCHAR(100)) 
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
	ID_U1 INTEGER;
	ID_U2 INTEGER;
	ID_U3 INTEGER;
BEGIN
	SELECT ID_USUARIO INTO ID_U1 FROM PACIENTES WHERE ID_PERSONA = ID_P;
	
	IF (ID_U1 IS NOT NULL) THEN
		UPDATE USERS 
		SET EMAIL = CORREO 
		WHERE ID = ID_U1;
	END IF;
	
	SELECT ID_USUARIO INTO ID_U2 FROM PROFESIONALES WHERE ID_PERSONA = ID_P;
	
	IF (ID_U2 IS NOT NULL) THEN
		UPDATE USERS SET EMAIL = CORREO WHERE ID = ID_U2;
	END IF;
	
	SELECT ID_USUARIO  INTO ID_U3 FROM ADMINISTRADORES WHERE ID_PERSONA = ID_P;
	
	IF (ID_U3 IS NOT NULL) THEN
		UPDATE USERS SET EMAIL = CORREO WHERE ID = ID_U3;
	END IF;
END;
$$;


SELECT CAMBIAR_MAIL(8, 'XDLK-FDLK')