var setupInvitationsCreate = function(){
	var deferred = q.defer();
	// setup users and properties
	var users = {
		adminuser: new User({username:"adminuser",email:"adminuser@mateit.com",password:"12345678",active:true,role:"admin"}),
		tHostUser: new User({username:"thostuser",email:"thost@user.com",password:"12345678",active:true}),
		tHostUser2: new User({username:"thostuser2",email:"thost2@user.com",password:"12345678",active:true}),
		tAnotherUser: new User({username:"tanotheruser",email:"tanother@user.com",password:"12345678,active:true"}),
		tInviteUser: new User({username:"tinviteuser",email:"tinvite@user.com",password:"12345678",active:true}),
		tInviteUser2: new User({username:"tinviteuser2",email:"tinvite2@user.com",password:"12345678",active:true})
	},
	properties = {
		tProperty: new Property({title:"property1",description:"asdasdasdasdasdasdasdasdsadasdasdasdasdas",address:"cerro viento circunvalacion E",price:200,loc:[20,-10],country:"PA",capacity:1,owner:users.tHostUser._id}),
		tProperty2: new Property({title:"property2",description:"asdasdasdasdasdasdasdasdsadasdasdasdasdas",address:"cerro viento circunvalacion E",price:200,loc:[20,-10],country:"PA",capacity:1,owner:users.tHostUser2._id,habitants:[users.tAnotherUser._id]})
	};


	users.tHostUser.property = {isOwner:true,data:properties.tProperty._id};
	users.tHostUser2.property = {isOwner:true,data:properties.tProperty2._id};
	users.tAnotherUser.property = {isOwner:false,data:properties.tProperty2._id};

	// join users and properties in one object
	var allEntities = _.extend(_.clone(users),properties);

	// save transactions
	var transactions = _.invoke(allEntities,'saveQ');

	q.all(transactions)
		.then(function(){
			deferred.resolve({
				users: users,
				properties: properties
			});
		})
		.catch(function(err){
			deferred.reject(err);
		});

	return deferred.promise;
}

var setupInvitationsConsume = function(){
	var deferred = q.defer();
	// setup users and properties
	var users = {
		adminuser: new User({username:"adminuser",email:"adminuser@mateit.com",password:"12345678",active:true,role:"admin"}),
		tHostUser: new User({username:"thostuser",email:"thost@user.com",password:"12345678",active:true}),
		tHostUser2: new User({username:"thostuser2",email:"thost2@user.com",password:"12345678",active:true}),
		tHostUser3: new User({username:"thostuser3",email:"thost3@user.com",password:"12345678",active:true}),
		tRoomateUser: new User({username:"troomuser",email:"troom@user.com",password:"12345678",active:true}),
		tInviteUser: new User({username:"tinviteduser",email:"tinvited@user.com",password:"12345678",active:true}),
		tInviteUser2: new User({username:"tinviteduser2",email:"tinvited2@user.com",password:"12345678",active:true}),
		tInviteUser3: new User({username:"tinviteduser3",email:"tinvited3@user.com",password:"12345678",active:true}),
		tInviteUser4: new User({username:"tinviteduser4",email:"tinvited4@user.com",password:"12345678",active:true})
	},
	properties = {
		tProperty: new Property({title:"property1",address:"cerro viento circunvalacion E",price:200,loc:[20,-10],country:"PA",description:"asdasdasdasdasdasdasdasdsadasdasdasdasdas",owner:users.tHostUser._id,capacity:1}),
		tPropertyFull: new Property({title:"property full",address:"cerro viento circunvalacion E",price:200,loc:[20,-10],country:"PA",description:"asdasdasdasdasdasdasdasdsadasdasdasdasdas",owner:users.tHostUser2._id,capacity:1,habitants:[users.tRoomateUser._id]}),
		tPropertyToRemove: new Property({title:"property to remove",address:"cerro viento circunvalacion E",price:200,loc:[20,-10],country:"PA",description:"asdasdasdasdasdasdasdasdsadasdasdasdasdas",owner:users.tHostUser3._id,capacity:1})
	},
	invitations = {
		tInvitation: new Invitation({host:users.tHostUser._id,property:properties.tProperty._id,email:users.tInviteUser.email}),
		tInvitation2: new Invitation({host:users.tHostUser._id,property:properties.tProperty._id,email:users.tInviteUser2.email}),
		tInvitationFull: new Invitation({host:users.tHostUser2._id,property:properties.tPropertyFull._id,email:users.tInviteUser3.email}),
		tInvitationNoExist: new Invitation({host:users.tHostUser3._id,property:properties.tPropertyToRemove._id,email:users.tInviteUser4.email})
	};


	//setup extra fields
	users.tHostUser.property = {isOwner:true,data:properties.tProperty._id};
	users.tHostUser2.property = {isOwner:true,data:properties.tPropertyFull._id};
	users.tHostUser3.property = {isOwner:true,data:properties.tPropertyToRemove._id};

	_.invoke(invitations,'generateKey');
	// join users,properties and invitations in one object
	var allEntities = _.extend(_.clone(users),properties,invitations);

	// save transactions
	var transactions = _.invoke(allEntities,'saveQ');

	q.all(transactions)
		.then(function(){
			properties.tPropertyToRemove.removeQ()
				.then(function(){
					deferred.resolve({
						users: users,
						properties: properties,
						invitations: invitations
					});
				})
				.catch(function(err){
					deferred.reject(err);
				})
		})
		.catch(function(err){
			deferred.reject(err);
		});

	return deferred.promise;
}

var setupUserCreate = function(){
	var deferred = q.defer();
	// setup users and properties
	var users = {
		tHostUser: new User({username:"thostuser",email:"thost@user.com",password:"12345678",active:true,active:true})
	};

	// save transactions
	var transactions = _.invoke(users,'saveQ');

	q.all(transactions)
		.then(function(){
			deferred.resolve({
				users: users
			});
		})
		.catch(function(err){
			deferred.reject(err);
		});

	return deferred.promise;
}

var setupUserList = function(){
	var deferred = q.defer();
	// setup users and properties
	var users = {
		adminuser: new User({username:"adminuser",email:"adminuser@mateit.com",password:"12345678",active:true,role:"admin"}),
		user1: new User({username:"usern1",email:"user1@user.com",password:"12345678",country:"panama",active:true}),
		user2: new User({username:"usern2",email:"user2@user.com",password:"12345678",country:"panama",active:true}),
		user3: new User({username:"usern3",email:"user3@user.com",password:"12345678",country:"panama",active:true}),
		user4: new User({username:"usern4",email:"user4@user.com",password:"12345678",country:"panama",active:true})
	};

	// save transactions
	var transactions = _.invoke(users,'saveQ');

	q.all(transactions)
		.then(function(){
			deferred.resolve({
				users: users
			});
		})
		.catch(function(err){
			deferred.reject(err);
		});

	return deferred.promise;
}

var setupUserDelete = function(){
	var deferred = q.defer();
	// setup users and properties
	var users = {
		adminuser: new User({username:"adminuser",email:"adminuser@mateit.com",password:"12345678",active:true,role:"admin"}),
		user1: new User({username:"usern1",email:"user1@user.com",password:"12345678",country:"panama",active:true}),
		user2: new User({username:"usern2",email:"user2@user.com",password:"12345678",country:"panama",active:true}),
		user3: new User({username:"usern3",email:"user3@user.com",password:"12345678",country:"panama",active:true}),
		user4: new User({username:"usern4",email:"user4@user.com",password:"12345678",country:"panama",active:true})
	};

	// save transactions
	var transactions = _.invoke(users,'saveQ');

	q.all(transactions)
		.then(function(){
			deferred.resolve({
				users: users
			});
		})
		.catch(function(err){
			deferred.reject(err);
		});

	return deferred.promise;
}

var setupPropertiesCreate = function(){
	var deferred = q.defer();
	// setup users and properties
	var users = {
		adminuser: new User({username:"adminuser",email:"adminuser@mateit.com",password:"12345678",active:true,role:"admin"}),
		user1: new User({username:"usern1",email:"user1@user.com",password:"12345678",country:"panama",active:true}),
		user2: new User({username:"usern2",email:"user2@user.com",password:"12345678",country:"panama",active:true})
	};

	// save transactions
	var transactions = _.invoke(users,'saveQ');

	q.all(transactions)
		.then(function(){
			deferred.resolve({
				users: users
			});
		})
		.catch(function(err){
			deferred.reject(err);
		});

	return deferred.promise;
};

var setupPropertiesList = function(){
	var deferred = q.defer();
	// setup users and properties
	var users = {
		adminuser: new User({username:"adminuser",email:"adminuser@mateit.com",password:"12345678",active:true,role:"admin"}),
		user1: new User({username:"usern1",email:"user1@user.com",password:"12345678",country:"PA",active:true}),
		user2: new User({username:"usern2",email:"user2@user.com",password:"12345678",country:"PA",active:true}),
		user3: new User({username:"usern3",email:"user3@user.com",password:"12345678",country:"PA",active:true}),
		user4: new User({username:"usern4",email:"user4@user.com",password:"12345678",country:"PA",active:true}),
		user5: new User({username:"usern5",email:"user5@user.com",password:"12345678",country:"PA",active:true}),
		user6: new User({username:"usern6",email:"user6@user.com",password:"12345678",country:"PA",active:true}),
		user7: new User({username:"usern7",email:"user7@user.com",password:"12345678",country:"PA",active:true}),
		user8: new User({username:"usern8",email:"user8@user.com",password:"12345678",country:"PA",active:true})
	},
	properties = {
		property1: new Property({title:"Apartamento en Torre Planetarium, Costa del Este",description:"asdasdasdasdasdasdasdasdsadasdasdasdasdas",address:"cerro viento circunvalacion E",price:110,loc:[9.010320, -79.466527],country:"PA",capacity:4,owner:users.user1._id}),
		property2: new Property({title:"Apartamento en Torre Vitri Costa del Este",description:"asdasdasdasdasdasdasdasdsadasdasdasdasdas",address:"cerro viento circunvalacion E",price:240,loc:[9.010516, -79.464295],country:"PA",capacity:3,owner:users.user2._id}),
		property3: new Property({title:"Apartamento en Pearl At The Sea",description:"asdasdasdasdasdasdasdasdsadasdasdasdasdas",address:"cerro viento circunvalacion E",price:130,loc:[9.010151, -79.465935],country:"PA",capacity:3,available:false,owner:users.user3._id,habitants:[users.user6._id,users.user7._id,users.user8._id]}),
		property4: new Property({title:"Apartamento en el dorado",description:"asdasdasdasdasdasdasdasdsadasdasdasdasdas",address:"cerro viento circunvalacion E",price:120,loc:[20,-10],country:"PA",capacity:2,owner:users.user4._id}),
		property5: new Property({title:"Aparatamento en el dorado tambien",description:"asdasdasdasdasdasdasdasdsadasdasdasdasdas",address:"cerro viento circunvalacion E",price:120,loc:[20,-10],country:"PA",capacity:2,owner:users.user5._id}),
	};


	users.user1.property = {isOwner:true,data:properties.property1._id};
	users.user2.property = {isOwner:true,data:properties.property2._id};
	users.user3.property = {isOwner:true,data:properties.property3._id};
	users.user4.property = {isOwner:true,data:properties.property4._id};
	users.user5.property = {isOwner:true,data:properties.property5._id};

	users.user6.property = {isOwner:false,data:properties.property3._id};
	users.user7.property = {isOwner:false,data:properties.property3._id};
	users.user8.property = {isOwner:false,data:properties.property3._id};

	// join users and properties in one object
	var allEntities = _.extend(_.clone(users),properties);

	// save transactions
	var transactions = _.invoke(allEntities,'saveQ');

	q.all(transactions)
		.then(function(){
			deferred.resolve({
				users: users,
				properties: properties,
				areas:{
					costa_del_este:[[9.007196, -79.478703],[9.024743, -79.458575]],
					el_dorado:[[9.007031, -79.536381],[9.011948, -79.530158]]
				}
			});
		})
		.catch(function(err){
			deferred.reject(err);
		});

	return deferred.promise;
}

exports.eraseDatabase = function(){
	return q.all([
		User.removeQ({}),
		Property.removeQ({}),
		Invitation.removeQ({}),
	]);
};

exports.invitations = {
	create: setupInvitationsCreate,
	consume: setupInvitationsConsume
};

exports.users = {
	create: setupUserCreate,
	list: setupUserList,
	del: setupUserDelete
};

exports.properties = {
	create: setupPropertiesCreate,
	list: setupPropertiesList
}