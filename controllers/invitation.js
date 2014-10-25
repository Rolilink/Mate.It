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
	propertyid = args.propertyid,
	email = args.email,
	handleSuccess = function(data){ cb(null,{property:data}); },
	handleError = function(err){	cb(err,null); };

	var createdInvitation = new Invitation({
		host: currentUser._id,
		propertyid: propertyid,
		email:email
	});

	createdInvitation.generateKey();

	if(currentUser.email != email)
		saveInvitation(createdInvitation).then(function(){ return createdInvitation.sendEmail(); }).then(handleSuccess,handleError);
	else
		handleError({err:'Cannot Invite owner',status:400});
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