'use strict';

module.exports = (sequelize, DataTypes) => {

	const User = sequelize.define('User', {
		firstname: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: {
					msg: "El nombre es requerido"
				},
			}
		},
		lastname: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				isAlpha: {
					msg: "El apellido solo puede contener letras"
				},
				notEmpty: {
					msg: "El apellido es requerido"
				},
			}
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				isEmail: {
					msg: "El email debe ser un correo valido"
				},

			}
		},
		username: {
			type: DataTypes.TEXT,
			allowNull: false,
			validate: {
				isAlphanumeric: {
					msg: "El nombre de usuario solo debe contener letras y números"
				},
				len: {
					args: [4, 20],
					msg: "El nombre debe contener mínimo 4 caracteres y maximo 20"
				}
			}
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notNull: {
					msg: "La contraseña es obligatoria"
				},
				notEmpty: {
					msg: "La contraseña es obligatoria"
				},
				len: {
					args: [6, 255],
					msg: "La contraseña debe contener mínimo 6 caracteres"
				}
			}
		},
	}, {
		tableName: "users"
	});

	User.associate = function (models) {
		User.hasOne(models.Image, { as: "images", foreignKey: "user_id" });
		User.belongsToMany(models.Role, { as: "roles", through: "user_role", foreignKey: "user_id" });
	};

	// check if user is admin
	User.isAdmin = function (roles) {
		return roles.map(role => role.role).includes('admin');
	}

	return User;
};
