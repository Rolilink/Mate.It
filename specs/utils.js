exports.eraseDatabase = function(){
	return q.all([
		User.removeQ({}),
		Property.removeQ({}),
		Invitation.removeQ({}),
		
	]);
};
