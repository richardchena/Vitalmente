const joi = require('joi');

//DATOS DEL USUARIO
const username = joi.string().min(4).required();
const email = joi.string().email().required();
const password = joi.string().min(8).max(20).required();
const role = joi.number().integer().min(1).max(3).required();

//DATOS DE LA PERSONA
const pri_nombre = joi.string().min(2).max(100).required();
const seg_nombre = joi.string().min(2).max(100);
const ter_nombre = joi.string().min(2).max(100);
const pri_apellido = joi.string().min(2).max(100).required();
const seg_apellido = joi.string().min(2).max(100);
const fec_nac = joi.date().required();
const nac = joi.number().integer().required();
const lugar_nac = joi.number().integer();
const estado_civ = joi.string().min(1).max(1).required();
const nro_doc = joi.string().min(1).max(50).required();

//DATOS DEL PACIENTE
const ocu = joi.string().min(1).max(100).required();

const crear_usuario = joi.object({
  //USER
  username,
  email,
  password,
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
  nro_doc,
  //PACIENTE
  ocu
});

const usuario_datos = joi.object({
  username
})

module.exports = { crear_usuario, usuario_datos }
