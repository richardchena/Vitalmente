const db = require('../models');
const Users = db.Users;

//Obtener el usuario por su identificador
exports.findByUsername = async (username) => {
    const query = `SELECT * FROM USERS WHERE LOWER(USERNAME) = LOWER('${username}')`

    try {
        const usuario = await db.sequelize.query(query);
        return usuario[0][0];
        
    } catch (error) {

        return null;
    }
    
};