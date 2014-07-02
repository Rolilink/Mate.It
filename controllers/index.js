global.seneca = require('seneca')();

require("fs").readdirSync("./controllers").forEach(function(file) {
  if(file != "index.js")
  	require("./" + file);
});