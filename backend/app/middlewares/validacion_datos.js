function validar_datos(schema, property) {
    return (req, res, next) => {
      const data = req[property];
      const { error } = schema.validate(data, { abortEarly: false });
      if (error) {
        return res.status(400).send(error.details[0].message);
        //next(res.status(400).send(error.details[0].message));
      }
      next();
    }
}
  
module.exports = validar_datos;