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

const mailConfig = {
    host_mail: process.env.HOST_MAIL,
    port_mail: process.env.PORT_MAIL,
    user_mail: process.env.USER_MAIL,
    pass_mail: process.env.PASS_MAIL
}

module.exports =  { config, dbConfig, mailConfig };