DROP FUNCTION IF EXISTS CAMBIAR_STATUS_PROFESIONAL(PROFESIONALES.ID_PROFESIONAL%TYPE);

CREATE OR REPLACE FUNCTION CAMBIAR_STATUS_PROFESIONAL (
	ID_PRO PROFESIONALES.ID_PROFESIONAL%TYPE
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
	ID_USER USERS.ID%TYPE;
	ESTADO USERS.STATUS%TYPE;
BEGIN
	SELECT ID_USUARIO INTO ID_USER
	FROM PROFESIONALES
	WHERE ID_PROFESIONAL = ID_PRO;
	
	SELECT STATUS INTO ESTADO
	FROM USERS
	WHERE ID = ID_USER;
		
	IF ESTADO = 'A' THEN
		UPDATE USERS
		SET STATUS = 'I'
		WHERE ID = ID_USER;
	ELSE 
		IF ESTADO = 'I' THEN
			UPDATE USERS
			SET STATUS = 'A'
			WHERE ID = ID_USER;
		END IF;
	END IF;
END;
$$;


SELECT CAMBIAR_STATUS_PROFESIONAL(3);
