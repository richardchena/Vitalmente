const nodemailer = require("nodemailer");
const { mailConfig } = require('../config')

exports.transporter = nodemailer.createTransport({
    host: mailConfig.host_mail,
    port: mailConfig.port_mail,
    secure: true,
    auth: {
        user: mailConfig.user_mail,
        pass: mailConfig.pass_mail
    },
});