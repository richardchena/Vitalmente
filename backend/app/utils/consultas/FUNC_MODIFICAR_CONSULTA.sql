

CREATE OR REPLACE FUNCTION MODIFICAR_CONSULTA (
	ID_CON CONSULTAS.ID_CONSULTA%TYPE,
	ID_ESP CONSULTAS.ID_ESPECIALIDAD%TYPE,
	MOT CONSULTAS.motivo%TYPE,
	DIG CONSULTAS.diagnostico_actual%TYPE,
	TEC CONSULTAS.tecnica_aplicada%TYPE,
	ANT CONSULTAS.antecedente%TYPE
)
RETURNS VARCHAR
LANGUAGE plpgsql
AS $$
BEGIN
	UPDATE CONSULTAS
	SET ID_ESPECIALIDAD = ID_ESP, MOTIVO = MOT, diagnostico_actual = DIG, tecnica_aplicada = tec, antecedente = ant
	WHERE ID_CONSULTA = ID_CON;
	
	RETURN '¡Consulta modificada correctamente!';
END; $$

SELECT MODIFICAR_CONSULTA(4, 4, 'cambiado el motivo', 'diagnostico cambiado', null, null);