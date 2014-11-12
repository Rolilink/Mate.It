var autoIncrement = require('mongoose-auto-increment');
global.mongoose = require('mongoose-q')(require('mongoose'));


module.exports = function loadModels(cb){
	var connection = mongoose.createConnection(app.get("mongoUrl"));

	connection.on('error',function(err){
		console.log(err);
		cb();
	})

	connection.once('open',function(){
		console.log('mongoDB open');
		autoIncrement.initialize(connection);
		require("fs").readdirSync("./models").forEach(function(file) {
			if(file != "index.js" && /\.js$/.test(file)){
				var modelName = file.charAt(0).toUpperCase() + file.slice(1).replace('.js','');
			  var modelSchema = require("./" + file);
			  modelSchema.plugin(autoIncrement.plugin,{ model: modelName, field: 'aId' });
			  global[modelName] = connection.model(modelName,modelSchema);
			  if(app.get("env") == "development"){
			  	console.log(modelName + " Model has been created");
			  }
			}
		});
		cb();
	});
}


