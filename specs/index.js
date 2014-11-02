var mateIt = require('../app'),
expect = require('chai').expect,
globalVars = {};

GLOBAL.expect = expect;

before(function(done){
	this.timeout(10000);
	process.env['NODE_ENV'] = 'testing';
	mateIt.init(function(){
		done();
	});
});


