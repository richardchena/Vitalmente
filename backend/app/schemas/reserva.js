const joi = require('joi');

const id_paciente = joi.number().integer().required();
const id_profesional = joi.number().integer().required();
const id_turno = joi.number().integer().min(1).max(2).required();
const id_especialidad = joi.number().integer().min(1).required();
const fecha = joi.string().max(9).required();
const hora = joi.string().max(8).required()


const crear_cita = joi.object({
    id_paciente,
    id_profesional,
    id_turno,
    id_especialidad,
    fecha,
    hora
})

module.exports = { crear_cita }