const { config } = require('../config');
const user = require('./user.controller');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.getUser = async (username, password) => {
  usuario = await user.findByUsername(username);
  if(!usuario) return null;

  const isMatch = await bcrypt.compare(password, usuario.password);

  if(!isMatch){
    return null;

  } else {
    //Eliminar datos sencibles del cliente para generar el token
    delete usuario.id;
    delete usuario.email;
    delete usuario.password;

    return usuario;
  }
}

exports.login = (req, res, next) => {
  res.json(firmarToken(req.user));
}

// Verificar token
exports.verifyToken = (req, res) => {
  const accessToken = req.body.accessToken;

  if (!accessToken)
    res.send({message: "¡Token invalido!"});
  else{
    try {
      res.json(jwt.verify(accessToken, config.authJwtSecret));

    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        res.send({message: '¡Token expirado!'});

      } else {
        res.send({message: "¡Token invalido!"});
      }
    }
  }
}

// Firmar un token
function firmarToken (user) {
    const payload = {
      sub: user.username,
      role: user.role
    }
    
    const accessToken = jwt.sign(payload, config.authJwtSecret, {expiresIn: config.json_expires});

    return {
      //user,
      accessToken
    };
}