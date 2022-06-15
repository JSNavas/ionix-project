const { User, Role, Image } = require('../models/Index');
const { Op } = require("sequelize");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth');
const ROLES_PERMISSIONS = require("../permissions/roles.permissions");

module.exports = {
    async find(req, res, next) {
        let user = await User.findByPk(req.params.id);

        if (!user) {
            res.status(404).json({ message: "Usuario no encontrado!" });
        } else {
            req.user = user;
            next();
        }
    },

    // index
    async index(req, res) {
        let users = await User.findAll({
			include: [
				{
				  model: Role,
				  as: 'roles',
				},
				{
				  model: Image,
				  as: 'images',
				}
			]
		});

        res.json(users);
    },

    // create
    async create(req, res) {
		const { roles, email, username } = req.body;
		// encrypt password
		let password = bcrypt.hashSync(req.body.password, Number.parseInt(authConfig.rounds));

		// unique email and username validation
		User.findOne({
			where: {
				email: email
			},
		}).then(user => {
			if (user) {
				res.status(400).json({
					status: false,
					message: "¡Este correo electrónico ya se encuentra registrado!"
				});
			}
		})

		User.findOne({
			where: {
				username: username
			},
		}).then(user => {
			if (user) {
				res.status(400).json({
					status: false,
					message: "¡Este nombre de usuario ya se encuentra registrado!"
				});
			}
		})

        User.create({
            firstname: req.body.firstname,
			lastname: req.body.lastname,
            email: req.body.email,
			username: req.body.username,
            password: password,
        })
        .then(user => {
			Role.findAll({
				where: {
					role: {
						[Op.or]: roles
					}
				}
			}).then(roles => {
				if (req.body.roles) {
					user.setRoles(roles).then(() => {
						// create token
						let token = jwt.sign({ user: user }, authConfig.secret, {
							expiresIn: authConfig.expires
						});

						res.json({
							status: true,
							message: 'Usuario creado exitosamente!',
							user: {
								id: user.id,
								firstname: user.firstname,
								lastname: user.lastname,
								email: user.email,
								username: user.username,
								roles: user.roles,
								images: user.images,
								updateAt: user.updatedAt,
								createAt: user.createdAt
							},
							token: token
						});
					});
				} else {
					user.setRoles(ROLES_PERMISSIONS.USER).then(() => {
						// create token
						let token = jwt.sign({ user: user }, authConfig.secret, {
							expiresIn: authConfig.expires
						});

						res.json({
							status: true,
							message: 'Usuario creado exitosamente!',
							user: {
								id: user.id,
								firstname: user.firstname,
								lastname: user.lastname,
								email: user.email,
								username: user.username,
								roles: user.roles,
								images: user.images,
								updateAt: user.updatedAt,
								createAt: user.createdAt
							},
							token: token
						});
					});
				}
			});

        })
        .catch(err => {
            res.status(500).json(err);
        });
    },

    // show
    async show(req, res) {
        res.json(req.user);
    },

    // update
    async update(req, res) {
        req.body.firstname ? req.user.firstname = req.body.firstname : null;
        req.body.lastname ? req.user.lastname = req.body.lastname : null;
        req.body.email ? req.user.email = req.body.email : null;
        req.body.username ? req.user.username = req.body.username : null;

        req.user.save().then(user => {
            res.json(user);
        })
    },

    // delete
    async delete(req, res) {
        req.user.destroy().then(user => {
            res.json({ message: "El usuario ha sido eliminado!" });
        })
    },
}
