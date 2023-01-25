DROP TABLE IF EXISTS PACIENTES;
DROP TABLE IF EXISTS PERSONAS;

CREATE TABLE PERSONAS (
	ID_PERSONA SERIAL PRIMARY KEY,
	PRIMER_NOMBRE VARCHAR(100) NOT NULL,
	SEGUNDO_NOMBRE VARCHAR(100) NULL,
	TERCER_NOMBRE VARCHAR(100) NULL,
	PRIMER_APELLIDO VARCHAR(100) NOT NULL,
	SEGUNDO_APELLIDO VARCHAR(100) NULL,
	FECHA_NACIMIENTO DATE NOT NULL,
	NACIONALIDAD INTEGER REFERENCES PAISES(ID_PAIS) DEFAULT 139 NOT NULL, --Por defecto Paraguay
	LUGAR_NACIMIENTO INTEGER REFERENCES CIUDADES(COD_CONCATENADO) NULL, --APLICA SOLO PARA PARAGUAYOS
	ESTADO_CIVIL VARCHAR(1) NOT NULL, --(S) Soltero (C) Casado (V) Viudo (D) Divorciado (O) Otros	
	NRO_DOC VARCHAR(50) NOT NULL
);

CREATE TABLE PACIENTES (
	ID_PACIENTE SERIAL PRIMARY KEY,
	ID_PERSONA INTEGER REFERENCES PERSONAS(ID_PERSONA),
	ID_USUARIO INTEGER REFERENCES USERS(ID),
	OCUPACION VARCHAR(100) NOT NULL
);