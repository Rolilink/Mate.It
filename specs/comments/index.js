var utils = require('../utils'),
request = require('supertest-as-promised'),
eraseDb = require ('../utils').eraseDatabase,
CommentsData = require('../utils').comments;

describe("Comments",function(){
	var baseUrl = "/api/comments";

	describe("Create",function(){
		var data;

		before(function(done){
			this.timeout(3000);

			CommentsData.create().then(function(rdata){
				data = rdata;
				done();
			})
			.catch(function(err){
				done(err);
			});
		});

		after(function(done){
			eraseDb()
			.then(function(){
				done();
			});
		});

		it("should have a comments module available",function(){
			expect(Comment).not.to.be.undefined;
		});

		it("should create a comment when doing a valid post",function(done){
			var client = request.agent(app);

			client
				.post('/login')
				.send({username:data.users.user1.username,password:"12345678"})
				.then(function(){
					return client
						.post(baseUrl)
						.send({
							comment:{
								property: data.properties.property2._id,
								content: "this is a new comment"
							}
						})
						.expect(201);
				})
				.then(function(res){
					var comment = res.body.comment;
					expect(comment).not.to.be.undefined;
					expect(comment).to.have.a.property('_id');
					expect(comment).to.have.a.property('property', data.properties.property2._id.toString());
					expect(comment).to.have.a.property('content', "this is a new comment");
					expect(comment).to.have.a.property('user', data.users.user1._id.toString());
					done();
				})
				.catch(done);
		});

		it("should respond with 401 when user is not authenticated",function(done){
			var client = request.agent(app);

			client
				.post(baseUrl)
				.send({
					property: data.properties.property2._id,
					content: "this is a new comment"
				})
				.expect(401)
				.then(function(res){
					done();
				})
				.catch(done);
		});

		it("should respond with 422 user already posted a comment in this property when trying to post a second comment in the same property",function(done){
			var client = request.agent(app);

			client
				.post('/login')
				.send({username:data.users.user2.username,password:"12345678"})
				.then(function(){
					return client
						.post(baseUrl)
						.send({
							comment:{
								property: data.properties.property2._id,
								content: "this is a new comment"
							}
						})
						.expect(201);
				})
				.then(function(){
					return client
						.post(baseUrl)
						.send({
							comment:{
								property: data.properties.property2._id,
								content: "this is a new comment"
							}
						})
						.expect(422);
				})
				.then(function(res){
					var errors = res.body.errors;
					expect(errors).not.to.be.undefined;
					expect(errors).to.have.property('user');
					expect(errors.user).to.have.property('message','user already posted a comment in this property');
					done();
				})
				.catch(done);
		});

		it("should respond with 422 and validation error object when validation fails",function(done){
			var client = request.agent(app);

			client
				.post('/login')
				.send({username:data.users.user1.username,password:"12345678"})
				.then(function(){
					return client
						.post(baseUrl)
						.send({
							comment:{
								content: "this is a new comment"
							}
						})
						.expect(422);
				})
				.then(function(res){
					var errors = res.body.errors;

					expect(errors).not.to.be.undefined;
					expect(errors).to.have.a.property('property');

					done();
				})
				.catch(done)
		});

		it("should respond with 422 property does not exist when property does not exist",function(done){
			var client = request.agent(app);

			client
				.post('/login')
				.send({username:data.users.user1.username,password:"12345678"})
				.then(function(){
					return client
						.post(baseUrl)
						.send({
							comment:{
								property: data.users.user1._id,
								content: "this is a new comment"
							}
						})
						.expect(422);
				})
				.then(function(res){
					var errors = res.body.errors;
					expect(errors).not.to.be.undefined;
					expect(errors).to.have.property('property');
					expect(errors.property).to.have.property('message','property does not exist');
					done();
				})
				.catch(done);
		});

	});

	describe("List",function(){
		var data;

		before(function(done){
			this.timeout(3000);

			CommentsData.list().then(function(rdata){
				data = rdata;
				done();
			})
			.catch(function(err){
				done(err);
			});
		});

		after(function(done){
			eraseDb()
			.then(function(){
				done();
			});
		});

	});

	describe("Delete",function(){
		var data;

		before(function(done){
			this.timeout(3000);

			CommentsData.create().then(function(rdata){
				data = rdata;
				done();
			})
			.catch(function(err){
				done(err);
			});
		});

		after(function(done){
			eraseDb()
			.then(function(){
				done();
			});
		});

	});

});