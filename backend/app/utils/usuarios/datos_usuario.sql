
/*
CREATE TYPE DATOS_RESPUESTA AS (
 EMAIL TEXT,
 NOMBRE TEXT,
 ROL TEXT,
 OCUPACION TEXT
);*/

DROP FUNCTION DATOS_USUARIO(USERS.USERNAME%TYPE);

CREATE OR REPLACE FUNCTION DATOS_USUARIO (
	usuario USERS.USERNAME%TYPE
)
RETURNS DATOS_RESPUESTA
LANGUAGE plpgsql
AS $$
DECLARE
	RESP DATOS_RESPUESTA%ROWTYPE;
	ROL USERS.ROLE%TYPE;
BEGIN

	SELECT ROLE INTO ROL
	FROM USERS
	WHERE LOWER(username) = LOWER(usuario);

	IF(ROL = 3) THEN
		select 
			b.email,
			c.primer_nombre || ' ' || c.primer_apellido as nombre,
			d.descripcion as rol,
			a.ocupacion
		INTO RESP
		from pacientes a
		inner join users b on b.id = a.id_usuario
		inner join personas c on c.id_persona = a.id_persona
		inner join roles d on d.id = b.role
		where LOWER(b.username) = LOWER(usuario);

		RETURN RESP;
	ELSIF (ROL = 2) THEN
		select 
			b.email,
			c.primer_nombre || ' ' || c.primer_apellido as nombre,
			d.descripcion as rol,
			null as ocupacion
		INTO RESP
		from profesionales a
		inner join users b on b.id = a.id_usuario
		inner join personas c on c.id_persona = a.id_persona
		inner join roles d on d.id = b.role
		where LOWER(b.username) = LOWER(usuario);

		RETURN RESP;
	ELSE
		select 
			b.email,
			c.primer_nombre || ' ' || c.primer_apellido as nombre,
			d.descripcion as rol,
			null as ocupacion
		INTO RESP
		from administradores a
		inner join users b on b.id = a.id_usuario
		inner join personas c on c.id_persona = a.id_persona
		inner join roles d on d.id = b.role
		where LOWER(b.username) = LOWER(usuario);

		RETURN RESP;
	END IF;
end; $$


SELECT DATOS_USUARIO('juan');


