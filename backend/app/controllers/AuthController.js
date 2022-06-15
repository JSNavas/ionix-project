const { User, Role, Image } = require('../models/Index');
const { Op } = require("sequelize");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth');
const ROLES_PERMISSIONS = require("../permissions/roles.permissions");

module.exports = {
	// login
	async login(req, res) {
		let { email, password } = req.body;

		// find user by email
		User.findOne({
			where: {
				email: email
			},
			include: [
				{
					model: Role,
					as: 'roles',
				},
				{
					model: Image,
					as: 'images',
				}
			],
		}).then(user => {
			if (!user) {
				res.status(404).json({
					status: false,
					message: "¡Usuario no encontrado!"
				});
			}

			let passwordIsValid = bcrypt.compareSync(password, user.password);

			if (!passwordIsValid) {
				res.status(401).json({
					status: false,
					message: "¡El correo electrónico o la contraseña no coinciden!"
				});
			}

			let token = jwt.sign({ user: user }, authConfig.secret, {
				expiresIn: authConfig.expires
			});

			res.json({
				status: true,
				message: "Successful login!",
				user: {
					id: user.id,
					firstname: user.firstname,
					lastname: user.lastname,
					email: user.email,
					username: user.username,
					images: user.images,
					role: user.roles.map(e => e.role),
					updateAt: user.updatedAt,
					createAt: user.createdAt
				},
				token: token
			})
		}).catch(err => {
			res.status(500).json({
				status: false,
				message: err
			});
		})
	},

	// register
	async register(req, res) {
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

		// create user
		User.create({
			firstname: req.body.firstname,
			lastname: req.body.lastname,
			email: req.body.email,
			username: req.body.username,
			password: password,
		}).then(user => {
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
								updateAt: user.updatedAt,
								createAt: user.createdAt
							},
							token: token
						});
					});
				}
			});
		}).catch(err => {
			res.status(400).json({
				status: false,
				message: err
			});
		});
	}
}
