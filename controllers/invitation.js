seneca.add({controller:'invitation',action:'create'},function(args,cb){
	var data = args.data,
	HostId = args.hostId,
	PropertyId = args.PropertyId,
	email = args.email,
	handleSuccess = function(data){ cb(null,{property:data}); },
	handleError = function(err){	cb(err,null); };

	var createdProperty = new Property(data);
	createdProperty.setOwner(ownerId);
	console.log(createdProperty);
	saveProperty(createdProperty).then(updateUserProperty).then(handleSuccess,handleError);
});