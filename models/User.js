var bcrypt = require('bcrypt-nodejs');

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('users', {
		username: {
				type: DataTypes.STRING,
				unqiue: true
				},
		password: DataTypes.STRING,
		role: DataTypes.STRING
	},
	{
		classMethods: {
			generateHash: function(password) {
				return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
			},
		},
		instanceMethods: {
			validPassword: function(password) {
				return bcrypt.compareSync(password, this.password);
			}
		}
	})
}