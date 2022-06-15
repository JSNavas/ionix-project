'use strict';

module.exports = (sequelize, DataTypes) => {
	const Image = sequelize.define('Image', {
		url: DataTypes.STRING,
		user_id: DataTypes.STRING
	}, {
		tableName: "images"
	});

	Image.associate = function (models) {
		Image.belongsTo(models.User, { as: "avatar", foreignKey: "user_id" })
	};

	return Image;
};