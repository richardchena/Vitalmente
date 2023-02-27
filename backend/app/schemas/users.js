const joi = require('joi');

const id_paciente = joi.number().integer().min(1).required();
const telf_numb = joi.string().regex(/^[0-9]{4}-[0-9]{3}-[0-9]{3}$/).required().messages({
  'string.base': `Formato incorrecto del número de télefono`,
  'string.empty': `El número de télefono no puede estar vacío`,
  'any.required': `Debe ingresar un número de télefono`,
  'string.pattern.base': 'Formato incorrecto del número de télefono'
});

//DATOS DEL USUARIO
const username = joi.string().min(4).required();
const email = joi.string().email().required();
const role = joi.number().integer().min(1).max(3).required();

//DATOS DE LA PERSONA
const pri_nombre = joi.string().min(2).max(100).required();
const seg_nombre = joi.string().min(2).max(100);
const ter_nombre = joi.string().min(2).max(100);
const pri_apellido = joi.string().min(2).max(100).required();
const seg_apellido = joi.string().min(2).max(100);
const fec_nac = joi.date().required();
//const nac = joi.number().integer().required();
const nac = joi.number().integer().min(0).max(300).required();
//const lugar_nac = joi.number().integer();
const lugar_nac = joi.number().integer().min(0).max(9999);
const estado_civ = joi.string().min(1).max(1).required();
const genero = joi.string().min(1).max(1).required();
const nro_doc = joi.string().min(1).max(50).required();

//DATOS DEL PACIENTE
const ocu = joi.string().min(2).max(100).required();

const crear_usuario = joi.object({
  //USER
  username,
  email,
  //password,
  role,
  //PERSONA
  pri_nombre,
  seg_nombre,
  ter_nombre,
  pri_apellido,
  seg_apellido,
  fec_nac,
  nac,
  lugar_nac,
  estado_civ,
  genero,
  nro_doc,
  //PACIENTE
  ocu,
  telf_numb
});

const usuario_datos = joi.object({
  username
})

const paciente = joi.object({
  id_paciente
})

module.exports = { crear_usuario, usuario_datos, paciente }
