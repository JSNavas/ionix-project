const { User } = require('../models/Index');

module.exports = {
    create(req, res, next) {
        if(User.isAdmin(req.user.roles)) {
            next();
        } else {
            res.status(401).json({ message: "No estas autorizado crear usuarios" });
        }
    },

    update(req, res, next) {
        if(User.isAdmin(req.user.roles)) {
            next();
        } else {
            res.status(401).json({ message: "No estas autorizado para actualizar este usuario" });
        }
    },

    delete(req, res, next) {
        if(User.isAdmin(req.user.roles)) {
            next();
        } else {
            res.status(401).json({ message: "No estas autorizado para eliminar este usuario" });
        }
    }
}
