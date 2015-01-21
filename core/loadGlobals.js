// Global for usage in models and controllers
global.express = require('express');
global.app = express();
app.models = {};
global._ = require('underscore');
global.async = require('async');
global.q = require('q');
global.passport = require('passport');
global.LocalStrategy = require('passport-local').Strategy;
global.ConnectRoles = require('connect-roles');
global.authorization = new ConnectRoles({
	failureHandler: function(req,res,action){
		var accept = req.headers.accept || '';
		res.status(401);
		res.send({response:"not authenticated or not authorized."});
	}
});

