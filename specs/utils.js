var setupInvitationsCreate = function(){
	var deferred = q.defer();
	// setup users and properties
	var users = {
		tHostUser: new User({username:"thostuser",email:"thost@user.com",password:"12345678",active:true}),
		tHostUser2: new User({username:"thostuser2",email:"thost2@user.com",password:"12345678",active:true}),
		tAnotherUser: new User({username:"tanotheruser",email:"tanother@user.com",password:"12345678,active:true"}),
		tInviteUser: new User({username:"tinviteuser",email:"tinvite@user.com",password:"12345678",active:true}),
		tInviteUser2: new User({username:"tinviteuser2",email:"tinvite2@user.com",password:"12345678",active:true})
	},
	properties = {
		tProperty: new Property({capacity:1,owner:users.tHostUser._id}),
		tProperty2: new Property({capacity:1,owner:users.tHostUser2._id,habitants:[users.tAnotherUser._id]})
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
		tProperty: new Property({owner:users.tHostUser._id,capacity:1}),
		tPropertyFull: new Property({owner:users.tHostUser2._id,capacity:1,habitants:[users.tRoomateUser._id]}),
		tPropertyToRemove: new Property({owner:users.tHostUser3._id,capacity:1})
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
		user1: new User({username:"usern1",email:"user1@user.com",password:"12345678",country:"panama",active:true}),
		user2: new User({username:"usern2",email:"user1@user.com",password:"12345678",country:"panama",active:true}),
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
	list: setupUserList
};