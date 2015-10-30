var express = require('express');
var router = express.Router();

/* GET users listing. */
module.exports.userPage = function(req, res, next) {
  res.render('users', keyInformation);
};

var keyInformation = {
						title: 'List of Users',
						user1: 'Max Ho',
						user2: 'Nathaniel', 
						user3: 'Sara Kwek',
						user4: 'Kwek Mingyan'
					};
//module.exports = router;
