/* 
 * User Controller
 * @author: Rolilink
 */


// Save User Function Wrapped in a Promise
var saveUser = function(user){
	var deferred = q.defer();
	user.save(function(err){
		if(err){
			return deferred.reject(err);
		}
		return deferred.resolve(user);
	});
	return deferred.promise;
}

// List Paginated Users Function Wrapped in a Promise
var findUsers = function(query,attr,page,limit){
	var deferred = q.defer();
	User.findPaginated(query,attr,page,limit).exec(function(err,users){
		if(err)
			return deferred.reject(err);
		return deferred.resolve(users);
	});
	return deferred.promise;
}

// Find User Function Wrapped in a Promise
var findUser = function(id,attr){
	var deferred = q.defer();
	User.findById(id,attr).exec(function(err,user){
		if(err)
			return deferred.reject(err);
		if(!user)
			return deferred.reject(new Error({message:"UserNotFound"}));
		return deferred.resolve(user);
	});
	return deferred.promise;
}

// Delete User Function Wrapped in a Promise
var deleteUser = function(user){
	var deferred = q.defer();
	user.remove(function(err,user){
		if(err)
			return deferred.reject(err);
		return deferred.resolve(user);
	});
	return deferred.promise
}

// Seneca MicroServices

//works
seneca.add({controller:'user',action:'create'},function(args,cb){
	var data = _.omit(args.data,['role','emailKey','active','aId','profilePicture','property']),
	user = new User(data),
	profilePicture = args.file,
	handleSuccess = function(data){ cb(null,{status:201,response:{user:{id:data.id,username:data.username,email:data.email,active:data.active}}}); },
	handleError = function(err){ cb(err,null); };

	saveUser(user).then(handleSuccess,handleError);
});

// check limit
seneca.add({controller:'user',action:'list'},function(args,cb){
	var page = args.page || 0,
	query = args.query || {},
	limit = args.limit || 10,
	handleSuccess = function(data){ cb(null,{users:data}); },
	handleError = function(err){ cb(err,null); };

	findUsers(query,args.blacklist,page,limit).then(handleSuccess,handleError);
});

//works
seneca.add({controller:'user',action:'get'},function(args,cb){
	var id = args.id,
	handleSuccess = function(data){ cb(null,{user:data}); },
	handleError = function(err){ cb(err,null); };
	
	findUser(id,args.blacklist).then(handleSuccess,handleError);
});

//works
seneca.add({controller:'user',action:'delete'},function(args,cb){
	var id = args.id,
	handleSuccess = function(data){ cb(null,{user:data}); },
	handleError = function(err){	cb(err,null); };

	findUser(id).then(deleteUser).then(handleSuccess,handleError);
});

//works
seneca.add({controller:'user',action:'update'},function(args,cb){
	var data = _.omit(args.data,['role','emailKey','active','aId','profilePicture','property']),
	id = args.id,
	profilePicture = args.file,
	handleSuccess = function(data){ cb(null,{user:data}); },
	handleError = function(err){	cb(err,null); },
	updateUser = function(user){ return _.extend(user,data); };

	return findUser(id,args.blacklist)
	.then(updateUser)
	.then(saveUser)
	.then(handleSuccess,handleError);
});

seneca.add({controller:'user',action:'editProfilePicture'},function(args,cb){
	var id = args.id,
	picture = args.picture,
	setPicture = function(user){ return user.setProfilePicture(picture); },
	handleSuccess = function(data){ cb(null,{picture:data}); },
	handleError = function(err){	cb(err,null); };
	findUser(id,args.blacklist).then(setPicture).then(saveUser).then(handleSuccess,handleError);
});

seneca.add({controller:'user', action:'addProperty'}, function(args,cb){
	var id = args.id,
	propid = args.propid,
	addProperty = function(user){ user.addProperty(propid); return user; },
	getProperty = function(user){ return user.getProperty(); },
	handleSuccess = function(data){ cb(null,{property:data}); },
	handleError = function(err){	cb(err,null); };

	findUser(id,args.blacklist).then(addProperty).then(saveUser).then(getProperty).then(handleSuccess,handleError);
});

seneca.add({controller:'user', action:'removeProperty'}, function(args,cb){
	var id = args.id,
	removeProperty = function(user){ user.removeProperty(); return user; },
	getProperty = function(user){ return user.getProperty(); },
	handleSuccess = function(data){ cb(null,{property:data}); },
	handleError = function(err){	cb(err,null); };

	findUser(id,args.blacklist).then(removeProperty).then(saveUser).then(getProperty).then(handleSuccess,handleError);
});

seneca.add({controller:'user',action:'deserializeUser'},function(args,cb){
	var id= args.id,
	handleSuccess = function(data){ cb(null,{user:data}); },
	handleError = function(err){	cb(err,null); };

	findUser(id,'-emailKey -aId').then(handleSuccess,handleError);
});

seneca.add({entity:'property',status:'created'},function(args,cb){
	var id = args.by,
	property = args.property,
	updateProperty = function(user){ return user.ownProperty(property); },
	handleSuccess = function(data){ cb(null,{user:data}); },
	handleError = function(err){	cb(err,null); };

	findUser(id,'-emailKey -aId').then(updateProperty).then(saveUser).then(handleSuccess,handleError);
});
