var utils = require('../utils'),
chai = require('chai'),
request = require('supertest-as-promised'),
eraseDb = require ('../utils').eraseDatabase,
invitationsData = require('../utils').invitations;


describe("Invitations:",function(){

	// Creating a new Invitation
	describe("Creating a new Invitation:",function(){
		var data;

		before(function(done){
			this.timeout(3000);
			invitationsData.create()
				.then(function(rdata){
					data = rdata;
					done();
				})
				.catch(function(err){
					done(err);
				})
		});

		after(function(done){
			eraseDb()
			.then(function(){
				done();
			});
		});

		it("should have an Invitation model available",function(){
			expect(Invitation).not.to.be.undefined; 
		});

		it("should return a valid response when doing a valid post",function(done){
			this.timeout(6000);
			var inviteUrl = "/api/properties/" + data.properties.tProperty.id + "/invite?email=" + data.users.tInviteUser.email;
			var client = request.agent(app);
			
			client.post('/login')
			.send({username:data.users.tHostUser.username,password:'12345678'})
			.then(function(){
				return client
					.post(inviteUrl)
					.send({})
					.expect(201)
					.expect({response:"sended"}) //change to sent
					.then(function(){
						done();
					})
			})
			.catch(function(err){
				done(err);
			});

		});

		it("should respond with a 401 code when user is not loged in",function(done){
			var client = request.agent(app),
			inviteUrl = "/api/properties/" + data.properties.tProperty.id + "/invite?email=" + data.users.tInviteUser.email;
			client
				.post(inviteUrl)
				.send({})
				.expect(401)
				.then(function(){
					done();
				})
				.catch(function(err){
					done(err);
				});
		});

		it("should respond with a 401 code when user is not property owner",function(done){
			var userNotOwner = request.agent(app),
			inviteUrl = "/api/properties/" + data.properties.tProperty.id + "/invite?email=" + data.users.tInviteUser.email;;
				userNotOwner
					.post('/login')
					.send({username:data.users.tHostUser2.username,password:'12345678'})
					.then(function(res){
						return userNotOwner
							.post(inviteUrl)
							.send({})
							.expect(401);
					})
					.then(function(res){
						userNotOwner.get('/logout')
						done();
					})
					.catch(function(err){
						done(err);
					});
		});

		it("should respond with a 422 code {err:user can't invite himself} when email is same as authenticated user",function(done){
			var userOwner = request.agent(app),
			inviteUrl = "/api/properties/" + data.properties.tProperty.id + "/invite?email=" + data.users.tHostUser.email;
				userOwner
					.post('/login')
					.send({username:data.users.tHostUser.username,password:'12345678'})
					.then(function(res){
						return userOwner
							.post(inviteUrl)
							.send({})
							.expect(422)
							.expect({err:"user can't invite himself"})
					})
					.then(function(res){
						userOwner.get('/logout')
						done();
					})
					.catch(function(err){
						done(err);
					});
		});

		it("should respond with a 422 code {err:user is already a roommate of a property} when the invited user exist and is listed as roommate of another property",function(done){
			var userOwner = request.agent(app),
			inviteUrl = "/api/properties/" + data.properties.tProperty.id + "/invite?email=" + data.users.tAnotherUser.email;
				userOwner
					.post('/login')
					.send({username:data.users.tHostUser.username,password:'12345678'})
					.then(function(res){
						return userOwner
							.post(inviteUrl)
							.send({})
							.expect(422)
							.expect({err:"user is already a roommate of a property"})
					})
					.then(function(res){
						userOwner.get('/logout')
						done();
					})
					.catch(function(err){
						done(err);
					});
		});

		it("should respond with a 422 code {err:invalid email format} when email is missing or invalid",function(done){
			var userOwner = request.agent(app),
			inviteUrl = "/api/properties/" + data.properties.tProperty.id + "/invite?email=";
				userOwner
					.post('/login')
					.send({username:data.users.tHostUser.username,password:'12345678'})
					.then(function(res){
						return userOwner
							.post(inviteUrl)
							.send({})
							.expect(422)
							.expect({err:"invalid email format"})
					})
					.then(function(res){
						userOwner.get('/logout')
						done();
					})
					.catch(function(err){
						done(err);
					});
		});
		it("should respond with a 422 code {err:Property is full can't send more invitations} when property is full",function(done){
			var userOwner = request.agent(app),
			inviteUrl = "/api/properties/" + data.properties.tProperty2.id + "/invite?email=" + data.users.tInviteUser2.email;
				userOwner
					.post('/login')
					.send({username:data.users.tHostUser2.username,password:'12345678'})
					.then(function(res){
						return userOwner
							.post(inviteUrl)
							.send({})
							.expect(422)
							.expect({err:"Property is full can't send more invitations"})
					})
					.then(function(res){
						userOwner.get('/logout')
						done();
					})
					.catch(function(err){
						done(err);
					});
		});
	});

	// Consuming an existing Invitation
	describe("Consuming a existing invitation:",function(){
		var data,consumeUrl = "/api/invitations/";
		
		before(function(done){
			this.timeout(3000);

			invitationsData.consume().then(function(rdata){
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

		it("should have an Invitation model available",function(){
			expect(Invitation).not.to.be.undefined; 
		});
		it("should return a valid response when doing a valid get",function(done){
			var client = request.agent(app);
			client
				.post("/login")
				.send({username:data.users.tInviteUser.username,password:"12345678"})
				.then(function(res){
					return client
						.get(consumeUrl + data.invitations.tInvitation.key)
						.expect(200)
						.expect({
							response:{
								status:"consumed",
								key:data.invitations.tInvitation.key,
								consumedBy:data.invitations.tInvitation.email
							}
						});
				})
				.then(function(res){
					done();
				})
				.catch(function(err){
					done(err);
				});
		});
		it("should respond with a 401 code when user is not loged in",function(done){
			var client = request.agent(app);
			client
				.get(consumeUrl + data.invitations.tInvitation.key)
				.expect(401)
				.then(function(res){
					done();
				})
				.catch(function(err){
					done(err);
				});
		});
		it("should respond with a 401 code when user email is not for invited user",function(done){	
			var client = request.agent(app);
			client
				.post("/login")
				.send({username:data.users.tHostUser.username,password:"12345678"})
				.then(function(res){
					return client
						.get(consumeUrl + data.invitations.tInvitation2.key)
						.expect(401);
				})
				.then(function(res){
					done();
				})
				.catch(function(err){
					done(err);
				});
		});
		it("should respond with a 422 code {err:property associated to this invitation is full} when property is full",function(done){
			var client = request.agent(app);
			client
				.post("/login")
				.send({username:data.users.tInviteUser3.username,password:"12345678"})
				.then(function(res){
					return client
						.get(consumeUrl + data.invitations.tInvitationFull.key)
						.expect(422)
						.expect({err:"property associated to this invitation is full"})
				})
				.then(function(res){
					done();
				})
				.catch(function(err){
					done(err);
				});
		});
		it("should respond with a 422 code {err:property associated to this invitation no longer exist} when property does not exist",function(done){
			var client = request.agent(app);
			client
				.post("/login")
				.send({username:data.users.tInviteUser4.username,password:"12345678"})
				.then(function(res){
					return client
						.get(consumeUrl + data.invitations.tInvitationNoExist.key)
						.expect(422)
						.expect({err:"property associated to this invitation no longer exist"})
				})
				.then(function(res){
					done();
				})
				.catch(function(err){
					done(err);
				});
		});

		it("should respond with a 422 code {err:invitation code not found, invalid or used} when invitation code does not exist",function(done){
			var client = request.agent(app);
			client
				.post("/login")
				.send({username:data.users.tInviteUser.username,password:"12345678"})
				.then(function(res){
					return client
						.get(consumeUrl + "badkeylol")
						.expect(422)
						.expect({ err: 'invitation code not found, invalid or used' });
				})
				.then(function(res){
					done();
				})
				.catch(function(err){
					done(err);
				});
		});
	});

});


