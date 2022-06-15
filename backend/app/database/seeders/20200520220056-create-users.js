'use strict';

const { User } = require('../../models/Index');
const bcrypt = require('bcrypt');
const authConfig = require('../../../config/auth');

module.exports = {
	up: (queryInterface, Sequelize) => {
		return Promise.all([

			User.create({
				firstname: "Admin",
				lastname: "Web",
				email: "admin@admin.com",
				username: "Admin",
				password: bcrypt.hashSync("123456", Number.parseInt(authConfig.rounds)),
			}),

			User.create({
				firstname: "User",
				lastname: "Web",
				email: "user@user.com",
				username: "user",
				password: bcrypt.hashSync("123456", Number.parseInt(authConfig.rounds)),
			}),
		]);
	},

	down: (queryInterface, Sequelize) => {
		return Promise.all([
			queryInterface.bulkDelete('users', null, {})
		]);
	}
};
