const { dbConfig } = require('../config/');
const Sequelize = require('sequelize');
const sequelize = new Sequelize(dbConfig.db, dbConfig.user, dbConfig.password, {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    //logging: false,  //sacar para ver el log
    //operatorsAliases: false,
    port: dbConfig.port,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    dialectOptions: {
        useUTC: false,
    },
    timezone: 'America/Asuncion'
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Definición de los modelos
//db.Users = require('./users')(sequelize, Sequelize);

module.exports = db;