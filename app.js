var http = require('http'),
path = require('path'),
repl = require("repl");
		
// AppRoot 
global.appRoot = __dirname;
require("./core/loadGlobals");
require("./core/loadConfig")();

// Start app
var start = function(done){
	http.createServer(app).listen(app.get('port'), function(){
		done();
	});
};


//load models,modules and controllers
require('./models')(function(){
	// wait until models are loaded to continue
	require('./controllers');
	require('./routes');
	if(require.main === module){
		start(function(){
		console.log('Express server listening on port ' + app.get('port'));
		});
		repl.start({
		  prompt: "MateIt:" + app.get("env") + "> ",
		  input: process.stdin,
		  output: process.stdout
		});
	}
});



exports.start = start;




