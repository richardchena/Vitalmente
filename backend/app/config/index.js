require ('dotenv').config();

const config = {
    authJwtSecret: process.env.AUTH_JWT_SECRET,
    port_server: process.env.PORT_SERVER,
    json_expires: process.env.JSON_EXPIRES
}

const dbConfig = {
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    port: process.env.PORT,
    db: process.env.DB,
    dialect: process.env.DIALECT,
}

module.exports =  { config, dbConfig };