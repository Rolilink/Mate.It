var utils = require('../../utils'),
request = require('supertest-as-promised'),
eraseDb = require ('../../utils').eraseDatabase,
UsersData = require('../../utils').users,
clearDir = require('../../utils').clearDir;

describe("Users",function(){
	var baseUrl = "/api/users";

	describe("Create",function(){
		var data;
		before(function(done){
			this.timeout(3000);

			UsersData.create().then(function(rdata){
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

		it("should have an User model available",function(){
			expect(User).not.to.be.undefined;
		});

		it("should respond 201 and return an user when doing a valid post",function(done){
			var client = request.agent(app);
			client
				.post(baseUrl)
				.send({user:{username:"newuser",email:"newuser@rolilink.com",password:'12345678'}})
				.expect(201)
				.then(function(res){
					var user = res.body.user;
					expect(user).not.to.be.undefined;
					expect(user).to.have.property('id');
					expect(user).to.have.property('email','newuser@rolilink.com');
					expect(user).to.have.property('username','newuser');
					expect(user).to.have.property('active',false);
					done();
				})
				.catch(function(err){
					done(err);
				});
		});
		it("should respond 422 when missing required fields and return an array of errors",function(done){
			var client = request.agent(app);
			client
				.post(baseUrl)
				.send({user:{username:"newuser"}})
				.expect(422)
				.then(function(res){
					var errors = res.body.errors;
					expect(errors).not.to.be.undefined;
					expect(errors).to.have.property("password");
					expect(errors).to.have.property("email");
					done();
				})
				.catch(function(err){
					done(err);
				});
		});

		it("should respond 422 when fields validate fails and return an array of errors",function(done){
			var client = request.agent(app);
			client
				.post(baseUrl)
				.send({user:{username:"n",email:"newuser@rolilink.com",password:'12345678'}})
				.expect(422)
				.then(function(res){
					
					var errors = res.body.errors;
					expect(errors).not.to.be.undefined;
					expect(errors).to.have.property("username");
					done();
				})
				.catch(function(err){
					done(err);
				});
		});
	});	

	describe("List",function(){
		var data, listUrl = baseUrl + "/list";

		before(function(done){
			this.timeout(3000);

			UsersData.list().then(function(rdata){
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

		it("should have an User model available",function(){
			expect(User).not.to.be.undefined;
		});

		it("should respond 200 and retrieve a list of users when doing a valid search",function(done){
			var client = request.agent(app);
			client
					.post('/login')
					.send({username:data.users.user1.username,password:'12345678'})
					.then(function(res){
						return client
							.post(listUrl)
							.send({
								query:{
									country: "panama"
								},
								limit: 2,
								page: 1
							})
							.expect(200)
					})
					.then(function(res){
						var users = res.body.users;
						var page = res.body.page;
						expect(users).to.have.length(2);
						expect(users).to.have.all.with.property("country","panama");
						expect(users).to.have.all.with.property("username");
						expect(users).to.have.all.with.property("email");
						expect(users).to.have.all.with.property("role");
						expect(users).to.have.all.with.property("active",true);
						expect(page).to.be.equals(1);
						done();
					})
					.catch(function(err){
						done(err);
					});
		});
		
		it("should respond 401 when user is not authenticated",function(done){
			var client = request.agent(app);

			client
				.post(listUrl)
				.send({
					query:{
						country: "panama"
					},
					limit: 2,
					page: 1
				})
				.expect(401)
				.then(function(){
					done();
				})
				.catch(function(err){
					done(err);
				})
		});
	});

	describe("Get",function(){
		var data, getUrl = baseUrl + "/";

		before(function(done){
			this.timeout(3000);

			UsersData.list().then(function(rdata){
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

		it("should have an User model available",function(){
			expect(User).not.to.be.undefined;
		});

		it("should get an user when doing a valid get request",function(done){
			var client = request.agent(app);
			client
				.post('/login')
				.send({username:data.users.user1.username,password:'12345678'})
				.then(function(res){
					return client
						.get(getUrl + data.users.user1.id)
						.expect(200)
				})
				.then(function(res){
					var user = res.body.user;
					expect(user).to.have.property("_id",data.users.user1.id);
					expect(user).to.have.property("username");
					expect(user).to.have.property("email");
					expect(user).to.have.property("role");
					expect(user).to.have.property("active",true);
					done();
				})
				.catch(function(err){
					done(err);
				});
		});

		it("should respond with 401 when user is not authenticated",function(done){
			var client = request.agent(app);

			client
				.get(getUrl + data.users.user1.id)
				.expect(401)
				.then(function(res){
					done();
				})
				.catch(function(err){
					done(err);
				})
		});

		it("should respond with 422 when providing a bad id",function(done){
			var client = request.agent(app);
			client
				.post('/login')
				.send({username:data.users.user1.username,password:'12345678'})
				.then(function(res){
					return client
						.get(getUrl + "assdsadasdlolbadkey")
						.expect(422)
				})
				.then(function(res){
					done()
				})
				.catch(function(err){
					done(err);
				});
		});

		it("should respond with 404 when user with that id is not found",function(done){
			var client = request.agent(app);
			client
				.post('/login')
				.send({username:data.users.user1.username,password:'12345678'})
				.then(function(res){
					return client
						.get(getUrl + "545327a2fe016f0000461675")
						.expect(404)
				})
				.then(function(res){
					done()
				})
				.catch(function(err){
					done(err);
				});
		});


	});

	describe("Update",function(){
		var data, updateUrl = baseUrl + "/";

		before(function(done){
			this.timeout(3000);

			UsersData.list().then(function(rdata){
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

		it("should have an User model available",function(){
			expect(User).not.to.be.undefined;
		});

		it("should update user when doing a valid post",function(done){
			var client = request.agent(app);
			client
				.post('/login')
				.send({username:data.users.user1.username,password:'12345678'})
				.then(function(){
					return client
						.post(updateUrl + data.users.user1.id)
						.send({
							user:{
								name:"ni idea"
							}
						})
						.expect(200)
				})
				.then(function(res){
					var user = res.body.user;
					expect(user).not.to.be.undefined;
					expect(user).to.have.property("name","ni idea");
					done();
				})
				.catch(function(err){
					done(err);
				})
		});

		it("should respond with 422 and errors when validation fails",function(done){
			var client = request.agent(app);
			client
				.post('/login')
				.send({username:data.users.user1.username,password:'12345678'})
				.then(function(){
					return client
						.post(updateUrl + data.users.user1.id)
						.send({
							user:{
								username:"n"
							}
						})
						.expect(422)
				})
				.then(function(res){
					var errors = res.body.errors;
					expect(errors).not.to.be.undefined;
					expect(errors).to.have.property("username");
					done();
				})
				.catch(function(err){
					done(err);
				})
		});

		it("should respond with 401 when trying to update another user",function(done){
			var client = request.agent(app);
			client
				.post('/login')
				.send({username:data.users.user1.username,password:'12345678'})
				.then(function(){
					return client
						.post(updateUrl + data.users.user2.id)
						.send({
							user:{
								username:"no idea"
							}
						})
						.expect(401)
				})
				.then(function(res){
					done();
				})
				.catch(function(err){
					done(err);
				})
		});

		it("should respond with 401 when user is not authenticated",function(done){
			var client = request.agent(app);
			client
				.post(updateUrl + data.users.user2.id)
				.send({
					user:{
						username:"no idea"
					}
				})
				.expect(401)
				.then(function(res){
					done();
				})
				.catch(function(err){
					done(err);
				})
		});

		it("should respond with 422 when providing a bad id with admin only",function(done){
			var client = request.agent(app);
			client
				.post('/login')
				.send({username:data.users.adminuser.username,password:'12345678'})
				.then(function(){
					return client
						.post(updateUrl + "assdsadasdlolbadkey")
						.send({
							user:{
								username:"no idea"
							}
						})
						.expect(422)
				})
				.then(function(res){
					done();
				})
				.catch(function(err){
					done(err);
				})
		});

		it("should respond with 404 when providing id dont exist with admin only",function(done){
			var client = request.agent(app);
			client
				.post('/login')
				.send({username:data.users.adminuser.username,password:'12345678'})
				.then(function(){
					return client
						.post(updateUrl + "545327a2fe016f0000461675")
						.send({
							user:{
								username:"no idea"
							}
						})
						.expect(404)
				})
				.then(function(res){
					done();
				})
				.catch(function(err){
					done(err);
				})
		});

	});

	describe("Delete",function(){
		var data, delUrl = baseUrl + "/";

		before(function(done){
			this.timeout(3000);

			UsersData.del().then(function(rdata){
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

		it("should have an User model available",function(){
			expect(User).not.to.be.undefined;
		});

		it("should delete user",function(done){
			var client = request.agent(app);
			var id = data.users.user4._id;
			client
				.post('/login')
				.send({username:data.users.user4.username,password:'12345678'})
				.then(function(res){
					return client
						.del(delUrl + data.users.user4.id)
						.expect(200)
				})
				.then(function(res){
					var user = res.body.user;
					expect(user).to.have.property("id",data.users.user4._id.toString());
					done();
				})
				.catch(function(err){
					done(err);
				});
		});

		it("should respond with 401 when user is not authenticated",function(done){
			var client = request.agent(app);
			client
				.del(delUrl + data.users.user4.id)
				.expect(401)
				.then(function(res){
					done();
				})
				.catch(function(err){
					done(err);
				})
		});

		it("should respond with 442 when providing a bad id",function(done){
			var client = request.agent(app);
			client
				.post('/login')
				.send({username:data.users.adminuser.username,password:'12345678'})
				.then(function(res){
					return client
						.del(delUrl + 'sadasdasbadkeylol')
						.expect(422)
				})
				.then(function(){
					done();
				})
				.catch(function(err){
					done(err);
				});
		});

		it("should respond with 404 when id dont exist",function(done){
			var client = request.agent(app);
			client
				.post('/login')
				.send({username:data.users.adminuser.username,password:'12345678'})
				.then(function(res){
					return client
						.del(delUrl + '545327a2fe016f0000461675')
						.expect(404)
				})
				.then(function(res){
					done();
				})
				.catch(function(err){
					done(err);
				});
		});

	});

	describe("Uploading Profile Picture",function(){
		var data;

		before(function(done){
			this.timeout(3000);

			UsersData.list().then(function(rdata){
				data = rdata;
				done();
			})
			.catch(function(err){
				done(err);
			});
		});

		after(function(done){
			clearDir("/public/uploads/profile/");
			eraseDb()
			.then(function(){
				done();
			});
		});

		it("should add a profile picture to the photo when doing a sucessful upload",function(done){
			var client = request.agent(app);
			client
				.post('/login')
				.send({username:data.users.user1.username,password:"12345678"})
				.then(function(){
					return client
						.post(baseUrl + '/' + data.users.user1._id + '/profilepic')
						.attach('picture','tests/acceptance/files/profilepic.jpg')
						.expect(200);
				})
				.then(function(res){
					var user = res.body.user;
					expect(user).not.to.be.undefined;
					expect(user).to.have.property('profilePicture','uploads/profile/usern1.jpg');
					done();
				})
				.catch(done)
		});

		it("should respond with 422 if the file uploaded is not an image",function(done){
			var client = request.agent(app);
			client
				.post('/login')
				.send({username:data.users.user1.username,password:"12345678"})
				.then(function(){
					return client
						.post(baseUrl + '/' + data.users.user1._id + '/profilepic')
						.attach('picture','package.json')
						.expect(422);
				})
				.then(function(res){
					var error = res.body.error;
					expect(error).not.to.be.undefined;
					expect(error).to.be.equals('file to upload is not an image');
					done();
				})
				.catch(done)
		});

		it("should respond with 401 when is not authenticated",function(done){
			var client = request.agent(app);
			client
				.post(baseUrl + '/' + data.users.user1._id + '/profilepic')
				.attach('picture','tests/acceptance/files/profilepic.jpg')
				.expect(401)
				.then(function(res){
					done()
				})
				.catch(done)
		});

		it("should respond with 404 when user does not exist",function(done){
			var client = request.agent(app);
			client
				.post('/login')
				.send({username:data.users.adminuser.username,password:"12345678"})
				.then(function(){
					return client
						.post(baseUrl + '/545327a2fe016f0000461675/profilepic')
						.attach('picture','tests/acceptance/files/profilepic.jpg')
						.expect(404);
				})
				.then(function(res){
					done();
				})
				.catch(done)
		});

		it("should respond with 401 when user is not self or admin",function(done){
			var client = request.agent(app);
			client
				.post('/login')
				.send({username:data.users.user1.username,password:"12345678"})
				.then(function(){
					return client
						.post(baseUrl + '/' + data.users.user2._id + '/profilepic')
						.attach('picture','tests/acceptance/files/profilepic.jpg')
						.expect(401);
				})
				.then(function(res){
					done();
				})
				.catch(done)
		});

		it("should respond with 422 when providing a bad user id",function(done){
			var client = request.agent(app);
			client
				.post('/login')
				.send({username:data.users.adminuser.username,password:"12345678"})
				.then(function(){
					return client
						.post(baseUrl + '/assdsadasdlolbadkey/profilepic')
						.attach('picture','tests/acceptance/files/profilepic.jpg')
						.expect(422);
				})
				.then(function(res){
					done();
				})
				.catch(done)
		});
	});

	describe("Leave Property",function(){
		var data;

		before(function(done){
			this.timeout(3000);

			UsersData.joinprop().then(function(rdata){
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

		it("Should leave the property and be reflected within user and property",function(done){
			var client = request.agent(app);
			client
				.post('/login')
				.send({username:data.users.user6.username,password:"12345678"})
				.then(function(){
					return client
						.del(baseUrl + '/' + data.users.user6._id + "/property")
						.expect(200)
				})
				.then(function(res){
					var property = res.body.property;
					
					expect(property).not.to.be.undefined;
					expect(property).to.have.a.property('habitants');
					expect(property).to.have.a.property('_id',data.properties.property3._id.toString());
					expect(property.habitants).to.be.an.array;
					expect(property.habitants).to.have.length(2);
					
					return client
						.get(baseUrl + '/' + data.users.user6._id)
						.expect(200);
				})
				.then(function(res){
					var user = res.body.user;

					expect(user).not.to.be.undefined;
					expect(user).to.have.a.property('property');
					expect(user.property.data).to.be.null;
					done();
				})
				.catch(done);

		});

		it("Should respond with 401 when user is not authenticated",function(done){
			var client = request.agent(app);

			client
				.del(baseUrl + '/' + data.users.user6._id + "/property")
				.expect(401)
				.then(function(){
					done();
				})
				.catch(done);
		});

		it("Should respond with 401 when user is not self",function(done){
			var client = request.agent(app);

			client
				.post('/login')
				.send({username:data.users.user6.username,password:"12345678"})
				.then(function(){
					return client
						.del(baseUrl + '/' + data.users.user1._id + "/property")
						.expect(401)
				})
				.then(function(res){
					done();
				})
				.catch(done);
		});

		it("Should respond with 422 user is not habitant of a property when user is not habitant of a property",function(done){
			var client = request.agent(app);

			client
				.post('/login')
				.send({username:data.users.user5.username,password:"12345678"})
				.then(function(){
					return client
						.del(baseUrl + '/' + data.users.user5._id + "/property")
						.expect(422)
				})
				.then(function(res){
					var error = res.body.error;
					expect(error).not.to.be.undefined;
					expect(error).to.be.equals('user is not habitant of a property');
					done();
				})
				.catch(done);
		});

		it("Should respond with 422 owners cant leave property when a owner is trying to leave property",function(done){
			var client = request.agent(app);

			client
				.post('/login')
				.send({username:data.users.user1.username,password:"12345678"})
				.then(function(){
					return client
						.del(baseUrl + '/' + data.users.user1._id + "/property")
						.expect(422)
				})
				.then(function(res){
					var error = res.body.error;
					expect(error).not.to.be.undefined;
					expect(error).to.be.equals('owners cant leave property');
					done();
				})
				.catch(done);
		});

	});
});