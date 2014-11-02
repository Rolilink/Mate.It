global.config = require('../conf');
var RedisStore = require('connect-redis')(express),
redis = require('redis').createClient(),
path = require("path");

function setUpEmail(){
	var mandrilKey = config.get("email:key"),
	mandrill = require('mandrill-api/mandrill');

	global.emailClient = new mandrill.Mandrill(mandrilKey);
};

function getConnectionUrl(){
	return "mongodb://" + config.get("db:host") + "/" + config.get("db:db");
};

function setAuthentication(){
	// Passport User based Session Configuration

	var serializeUser = function(user,done){
		done(null,user.id);
	};

	var deserializeUser = function(id,done){
		seneca.act({controller:'user',action:'get',id:id,blacklist:'-password -emailKey -aId'},function(err,result){
			if(err){
				return done(err);
			}
			return done(null,result.user);
		});
	};


	var checkUserCredentials = function(username,password,done){
		seneca.act({controller:'user',action:'list',query:{username:username},limit:1,page:1,blacklist:'-emailKey -aId'},function(err,result){
			if(err){
				return done(err);
			}

			var user = result.users[0];


			// if there is no user returned
			if(!user){
				return done(null,false,{message:"Incorrect Username"});
			}

			// if there is no password returned

			if(!user.compareHash(password)){
				return done(null,false,{message:"Incorrect Password"});
			}

			return done(null,user);
		});	
	};


	passport.use(new LocalStrategy(checkUserCredentials));
	passport.serializeUser(serializeUser);
	passport.deserializeUser(deserializeUser);
};

function setAuthorization(){

	// is Autenticated
	authorization.use(function (req){
		if(!req.isAuthenticated()){
			return false;
		}
	});

	// is Admin
	authorization.use(function (req){
		if(req.user.role === 'admin')
			return true;
	});

	// is User
	authorization.use('User',function (req){
		if(req.user.role === 'user');
			return true;
	});

	// is Property Owner
	authorization.use('Owner',function (req){
		if(req.user.isOwner(req.param('id')))
			return true;
	});

	// is Self
	authorization.use('Self',function (req){
		if(req.user.id === req.param('id'))
			return true;
	});

	// Can Create Property
	authorization.use('Create Property', function (req){
		return !req.user.haveProperty();
	});

};

function setConfig(){
	// Set Auth
	setAuthentication();

	//Set Authorization
	setAuthorization();

	//Setup Transactional Email
	setUpEmail();
	
	app.set("publicdir", path.join(appRoot, 'public'));
	app.set("mongoUrl", getConnectionUrl());
	app.set('port', config.get("server:port"));
	app.set('views',path.join(appRoot, 'views'));
	app.set('view engine', 'jade');
	app.use(express.favicon());
	if('testing' != app.get('env')){
		app.use(express.logger('dev'));
	};
	app.use(express.json());
	app.use(express.urlencoded());
	app.use(express.methodOverride());
	app.use(express.cookieParser());
	app.use(express.bodyParser());
	app.use(express.session({
		secret: 'cats wants to see the world burn',
		store: new RedisStore({host:'localhost',port: 6497, client:redis})
	}));
	app.use(passport.initialize());
  app.use(passport.session());
  app.use(authorization.middleware());
	app.use(app.router);
	app.use(express.static(path.join(appRoot, 'public')),{maxAge:1});
	// development only
	if ('development' == app.get('env')) {
	  app.use(express.errorHandler());
	}

};

module.exports = setConfig;