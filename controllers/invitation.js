var saveInvitation = function(invitation){
	var deferred = q.defer();

	invitation.save(function(err){
		if(err)
			return deferred.reject(err);
		return deferred.resolve(invitation);
	});
	return deferred.promise;
}

seneca.add({controller:'invitation',action:'create'},function(args,cb){
	var currentUser = args.currentUser,
	propertyid = args.propertyId,
	email = args.email,
	handleResponse = function(response){ cb(null,response); },
	handleError = function(err){	console.log(err); cb(err,null); };

	var createdInvitation = new Invitation({
		host: currentUser._id,
		property: propertyid,
		email:email
	});

	if(!email || /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}/.test(email))
		handleResponse({err:"invalid email format",status:422});

	if(currentUser.email != email){
		createdInvitation.generateKey();
		saveInvitation(createdInvitation).then(function(){ return createdInvitation.sendEmail(); }).then(handleResponse,handleError);
	}
	else{
		handleResponse({err:"user can't invite himself",status:422});
	}
});

seneca.add({controller:'invitation',action:'consume'},function(args,cb){
	var currentUser = args.currentUser,
	key = args.key,
	handleSuccess = function(data){ cb(null,{response:data}); },
	handleError = function(err){	cb(err,null); };

	Invitation.find({key:key}).exec().	
	then(function(invitations,err){
		if(err)
			return handleError();

		var invitation = invitations[0];

		invitation.consume(currentUser)
		.then(handleSuccess,handleError);
	});

});