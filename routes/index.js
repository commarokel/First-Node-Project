var express = require('express');
var router = express.Router();

/* GET home page. */
module.exports.mainPage = function(req, res, next) {
  res.render('index', keyInformation);
};

var keyInformation = {
	title: 'Node JS',
	name: 'Max', age: 29,
	interests: 'soccer',
	}

module.exports.profilePage = function(req, res) {
	var username = req.session.username;
	var test = req.session.test;
	var day = new Date().getDate();
	var month = new Date().getMonth() + 1;
	var year = new Date().getFullYear();
	res.render('profile', {username: username, test: test, date: day + 'th ' +  month + ' ' + year});
}


module.exports.adminDashboard = function(req, res) {
	var username = req.session.username;
	var test = req.session.test;
	var day = new Date().getDate();
	var month = new Date().getMonth() + 1;
	var year = new Date().getFullYear();
	res.render('admin-dashboard', {username: username, test: test, date: day + 'th ' +  month + ' ' + year});
}