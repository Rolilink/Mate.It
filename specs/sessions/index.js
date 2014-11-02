/*var chai = require('chai'),
request = require('supertest-as-promised');

describe("Sessions",function(){
	var tUser;
	before(function(done){
		// setup users
		tUser = new User({username:"testuser",email:"test@user.com",password:"12345678"});
		tUser.saveQ().then(function(){
			done();
		});

	});

	after(function(done){
		q.all([
			User.removeQ({}),
		])
		.then(function(){
			done();
		});
	});

	it("Should create a new session when posting to /login",function(){
		var client = 
	});
});
*/