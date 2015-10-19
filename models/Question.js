module.exports = function(sequelize, DataTypes) {
	return sequelize.define('question', {
		title: {
				type: DataTypes.STRING,
				unqiue: true
				},
		content: DataTypes.STRING,
		tag: DataTypes.STRING
	}
}