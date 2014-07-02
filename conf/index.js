var nconf = require('nconf');
function config(){
	nconf.argv().env("_");
	var environment = nconf.get("NODE:ENV") || "development";
	nconf.file(environment,"./conf/" + environment + ".json");
	nconf.file("default", "./conf/default.json");
	return nconf;
}
module.exports = config();
