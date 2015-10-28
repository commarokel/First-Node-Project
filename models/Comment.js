module.exports = function(sequelize, DataTypes) {
	return sequelize.define('comments', {
		content: DataTypes.TEXT
	})
}