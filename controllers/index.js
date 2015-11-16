var express = require('express');
var router = express.Router();

/* GET home page. */
module.exports.mainPage = function(req, res, next) {
	var keyInformation = {
							userLoggedIn: req.isAuthenticated(),
							username: req.session.username
						};
  	res.render('index', keyInformation);
};


module.exports.profilePage = function(req, res) {
	var username = req.session.username;
	var test = req.session.test;
	var day = new Date().getDate();
	var month = new Date().getMonth() + 1;
	var year = new Date().getFullYear();
	res.render('profile', {username: username, test: test, date: day + 'th ' +  month + ' ' + year});
};


module.exports.adminDashboard = function(req, res) {
	var username = req.session.username;
	var test = req.session.test;
	var day = new Date().getDate();
	var month = new Date().getMonth() + 1;
	var year = new Date().getFullYear();
	res.render('admin-dashboard', {username: username, test: test, date: day + 'th ' +  month + ' ' + year});
};