module.exports = function(sequelize, DataTypes) {
	return sequelize.define('question', {
		title: {
				type: DataTypes.STRING,
				unqiue: true
				},
		content: DataTypes.TEXT,
		tag: DataTypes.STRING,
		author: DataTypes.TEXT,
		slug: DataTypes.TEXT,
		votes: DataTypes.INTEGER
	})
}