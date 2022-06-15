require('dotenv').config()

module.exports = {
	// database config
	username: process.env.DB_USERNAME || "root",
	password: process.env.DB_PASSWORD || "root",
	database: process.env.DB_DATABASE || "database",
	host: process.env.DB_HOST || "127.0.0.1",
	dialect: process.env.DB_DIALECT || "mysql",

	// seeders config
	seederStorage: "sequelize",
	seederStorageTableName: "seeds",

	// migrations config
	migrationStorage: "sequelize",
	migrationStorageTableName: "migrations"
}
