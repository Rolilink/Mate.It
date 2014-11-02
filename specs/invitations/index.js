var utils = require('../utils'),
chai = require('chai'),
request = require('supertest-as-promised');


describe("Invitations:",function(){
	
	// Creating a new Invitation
	describe("Creating a new Invitation:",function(){
		var tHostUser,tInviteUser,tProperty,tAnotherUser,tHostAgent,tHostUser2,tProperty2;
		before(function(done){
			// setup users
			tHostUser = new User({username:"thostuser",email:"thost@user.com",password:"12345678"});
			tHostUser2 = new User({username:"thostuser2",email:"thost2@user.com",password:"12345678"});
			tAnotherUser = new User({username:"tanotheruser",email:"tanother@user.com",password:"12345678"});
			tInviteUser = new User({username:"tinviteuser",email:"tinvite@user.com",password:"12345678"});
			tInviteUser2 = new User({username:"tinviteuser2",email:"tinvite2@user.com",password:"12345678"});
			tProperty = new Property({capacity:1,owner:tHostUser._id});
			tProperty2 = new Property({capacity:1,owner:tHostUser2._id,habitants:[tAnotherUser._id]});

			tHostUser.property = {isOwner:true,data:tProperty._id};
			tHostUser2.property = {isOwner:true,data:tProperty2._id};
			tAnotherUser.property = {isOwner:false,data:tProperty2._id};

			var saveTransactions = q.all([
				tHostUser.saveQ(),
				tHostUser2.saveQ(),
				tInviteUser.saveQ(),
				tInviteUser2.saveQ(),
				tAnotherUser.saveQ(),
				tProperty.saveQ(),
				tProperty2.saveQ()
			]);

			saveTransactions.then(function(){
				//Log in Agents
				tHostAgent = request.agent(app);
				tHostAgent.post('/login')
				.send({username:tHostUser.username,password:'12345678'})
				.then(function(){
					done();
				})
				.catch(function(err){
					done(err);
				})
			})
			.catch(function(err){
				done(err);
			});

		});

		after(function(done){
			q.all([
				User.removeQ({}),
				Property.removeQ({}),
				Invitation.removeQ({})
			])
			.then(function(){
				done();
			});
		});

		it("should have an Invitation model available",function(){
			expect(Invitation).not.to.be.undefined; 
		});

		it("should return a valid response when doing a valid post",function(done){
			this.timeout(6000);
			var inviteUrl = "/api/properties/" + tProperty.id + "/invite?email=" + tInviteUser.email;
			
			tHostAgent
				.post(inviteUrl)
				.send({})
				.expect(201)
				.expect({response:"sended"})
				.then(function(){
					done();
				})
				.catch(function(err){
					done(err);
				});

		});

		it("should respond with a 401 code when user is not loged in",function(done){
			var client = request.agent(app),
			inviteUrl = "/api/properties/" + tProperty.id + "/invite?email=" + tInviteUser.email;
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
			inviteUrl = "/api/properties/" + tProperty.id + "/invite?email=" + tInviteUser.email;;
				userNotOwner
					.post('/login')
					.send({username:tHostUser2.username,password:'12345678'})
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
			inviteUrl = "/api/properties/" + tProperty.id + "/invite?email=" + tHostUser.email;
				userOwner
					.post('/login')
					.send({username:tHostUser.username,password:'12345678'})
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
			inviteUrl = "/api/properties/" + tProperty.id + "/invite?email=" + tAnotherUser.email;
				userOwner
					.post('/login')
					.send({username:tHostUser.username,password:'12345678'})
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
			inviteUrl = "/api/properties/" + tProperty.id + "/invite?email=";
				userOwner
					.post('/login')
					.send({username:tHostUser.username,password:'12345678'})
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
			inviteUrl = "/api/properties/" + tProperty2.id + "/invite?email=" + tInviteUser2.email;
				userOwner
					.post('/login')
					.send({username:tHostUser2.username,password:'12345678'})
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
		var tHostUser,tInviteUser,tProperty,tInvitation,consumeUrl = "/invitation/";
		before(function(done){
			this.timeout(3000);

			// setup users
			tHostUser = new User({username:"thostuser",email:"thost@user.com",password:"12345678"});
			tHostUser2 = new User({username:"thostuser2",email:"thost2@user.com",password:"12345678"});
			tHostUser3 = new User({username:"thostuser3",email:"thost3@user.com",password:"12345678"});
			tRoomateUser = new User({username:"troomuser",email:"troom@user.com",password:"12345678"})
			tInviteUser = new User({username:"tinviteduser",email:"tinvited@user.com",password:"12345678"});
			tInviteUser2 = new User({username:"tinviteduser2",email:"tinvited2@user.com",password:"12345678"});
			
			// setup properties
			tProperty = new Property({owner:tHostUser._id,capacity:1});
			tPropertyFull = new Property({owner:tHostUser2._id,capacity:1,habitants:[tRoomateUser._id]});
			tPropertyToRemove = new Property({owner:tHostUser3._id,capacity:1});

			//setup invitations
			tInvitation  = new Invitation({host:tHostUser._id,property:tProperty._id,email:tInviteUser.email});
			tInvitationFull = new Invitation({host:tHostUser2._id,property:tPropertyFull._id,email:tInviteUser2.email});
			tInvitationNoExist = new Invitation({host:tHostUser3._id,property:tPropertyToRemove._id,email:tInviteUser2.email});

			//setup extra fields
			tHostUser.property = {isOwner:true,data:tProperty._id};
			tHostUser2.property = {isOwner:true,data:tPropertyFull._id};
			tHostUser3.property = {isOwner:true,data:tPropertyToRemove._id};

			tInvitation.generateKey();
			tInvitationFull.generateKey();
			tInvitationNoExist.generateKey();

			var saveTransactions = q.all([
				tHostUser.saveQ(),
				tHostUser2.saveQ(),
				tHostUser3.saveQ(),
				tInviteUser.saveQ(),
				tInviteUser2.saveQ(),
				tRoomateUser.saveQ(),
				tProperty.saveQ(),
				tPropertyFull.saveQ(),
				tPropertyToRemove.saveQ(),
				tInvitation.saveQ(),
				tInvitationFull.saveQ(),
				tInvitationNoExist.saveQ()
			]);

			saveTransactions.then(function(){
				//Log in Agents
				tPropertyToRemove.removeQ()
					.then(function(){
						done();
					})
					.catch(function(err){
						done(err);
					})
			})
			.catch(function(err){
				done(err);
			});

		});


		after(function(done){
			q.all([
				User.removeQ({}),
				Property.removeQ({}),
				Invitation.removeQ({})
			])
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
				.send({username:tInviteUser.username,password:"12345678"})
				.then(function(res){
					return client
						.get(consumeUrl + tInvitation.key)
						.expect(200)
						.expect({
							response:{
								status:"consumed",
								key:tInvitation.key,
								consumedBy:tInvitation.email
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
				.get(consumeUrl + tInvitation.key)
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
				.send({username:tHostUser.username,password:"12345678"})
				.then(function(res){
					return client
						.get(consumeUrl + tInvitation.key)
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
				.send({username:tHostInviteUser2.username,password:"12345678"})
				.then(function(res){
					return client
						.get(consumeUrl + tInvitationFull.key)
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
				.send({username:tInviteUser3.username,password:"12345678"})
				.then(function(res){
					return client
						.get(consumeUrl + tInvitationNoExist.key)
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
				.send({username:tInviteUser.username,password:"12345678"})
				.then(function(res){
					return client
						.get(consumeUrl + "badkeylol")
						.expect(200)
						.expect({
							response:{
								status:"consumed",
								key:tInvitation.key,
								consumedBy:tInvitation.email
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
	});

});


