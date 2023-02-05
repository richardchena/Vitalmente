

CREATE TYPE DATOS_RESPUESTA AS (
 EMAIL TEXT,
 NOMBRE TEXT,
 ROL TEXT,
 OCUPACION TEXT
);

CREATE OR REPLACE FUNCTION DATOS_USUARIO (
	usuario USERS.USERNAME%TYPE
)
RETURNS DATOS_RESPUESTA
LANGUAGE plpgsql
AS $$
DECLARE
	RESP DATOS_RESPUESTA%ROWTYPE;
BEGIN
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
end; $$


