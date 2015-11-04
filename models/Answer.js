module.exports = function(sequelize, DataTypes) {
	return sequelize.define('answers', {
		content: DataTypes.TEXT,
		author: DataTypes.STRING,
		votes: DataTypes.INTEGER
	})
}