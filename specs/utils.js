var setupInvitationsCreate = function(){
	var deferred = q.defer();
	// setup users and properties
	var users = {
		tHostUser: new User({username:"thostuser",email:"thost@user.com",password:"12345678"}),
		tHostUser2: new User({username:"thostuser2",email:"thost2@user.com",password:"12345678"}),
		tAnotherUser: new User({username:"tanotheruser",email:"tanother@user.com",password:"12345678"}),
		tInviteUser: new User({username:"tinviteuser",email:"tinvite@user.com",password:"12345678"}),
		tInviteUser2: new User({username:"tinviteuser2",email:"tinvite2@user.com",password:"12345678"})
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
	console.log(transactions[0]);
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