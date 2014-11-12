var http = require('http'),
path = require('path'),
repl = require("repl");
		


// Start WebServer
var start = function(done){
	http.createServer(app).listen(app.get('port'), function(){
		done();
	});
};

// Init Application
var init = function(cb){
	// AppRoot 
	global.appRoot = __dirname;
	require("./core/loadGlobals");
	require("./core/loadConfig")();
	//load models,modules and controllers
	require('./models')(function(){
		// wait until models are loaded to continue
		require('./controllers');
		require('./routes');
		start(function(){
			cb(global);
		});
	});
}


if(require.main === module){
	init(function(){
		console.log('app started');
	});
}



exports.init = init;




