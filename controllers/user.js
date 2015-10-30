var express = require('express');
var passport = require('passport');

/* GET Signup Form. */
module.exports.getsignup = function(req, res) {
  res.render('account/signup');
};

module.exports.getLogin = function(req, res) {
	var isLoggedIn = { isLoggedIn: req.isAuthenticated() }
	res.render('account/login', isLoggedIn);
};