var mateIt = require('../app'),
chai = require('chai'),
globalVars = {};

chai.use(require('chai-things'));
GLOBAL.expect = chai.expect;

before(function(done){
	this.timeout(10000);
	process.env['NODE_ENV'] = 'testing';
	mateIt.init(function(){
		done();
	});
});


