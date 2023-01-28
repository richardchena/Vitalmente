
function checkRoles(...roles) {
    return (req, res, next) => {
        const user = req.user;
        if (roles.includes(descripcion_role(user.role))) {
            next();
        } else {
            return res.status(401).send('El usuario no cuenta con los permisos necesarios');
            //next(res.status(401).send('El usuario no cuenta con los permisos necesarios')); //Usuario no autorizado para acceder
        }
    }
}

function descripcion_role(id_rol) {
    if (id_rol === 1) {
        return 'admin';
    } else if (id_rol === 2) {
        return 'profesional';
    } else if (id_rol === 3) {
        return 'paciente';
    } else {
        return null;
    }
}

module.exports = { checkRoles };