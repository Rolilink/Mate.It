var config = require('../conf'),
		path = require("path");

function getConnectionUrl(){
	return "mongodb://" + config.get("db:host") + "/" + config.get("db:db");
}

function setConfig(){
	app.set("publicdir", path.join(appRoot, 'public'));
	app.set("mongoUrl", getConnectionUrl());
	app.set('port', process.env.PORT || config.get("server:port"));
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.json());
	app.use(express.urlencoded());
	app.use(express.methodOverride());
	app.use(express.cookieParser());
	app.use(express.bodyParser());
	app.use(app.router);
	app.use(express.static(path.join(appRoot, 'public')),{maxAge:1});

	// development only
	if ('development' == app.get('env')) {
	  app.use(express.errorHandler());
	}

};

module.exports = setConfig;