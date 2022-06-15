const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth');
const { User } = require('../models/Index'); 

module.exports = (req, res, next) => {

    // verify token
    if(!req.headers.authorization) {
        res.status(401).json({ msg: "Acceso no autorizado" });
    } else {

        // get token
        let token = req.headers.authorization.split(" ")[1];

        // verify
        jwt.verify(token, authConfig.secret, (err, payload) => {

            if(err) {
                res.status(500).json({ msg: "Ha ocurrido un problema al decodificar el token", err });
            } else {
                User.findByPk(payload.user.id, { include: "roles" }).then(user => {
                    req.user = user;
                    next();
                });
            }
        })
    }
};