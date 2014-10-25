app.post('/api/properties/:id/invite',authorization.is('Owner'),function(req,res,next){
	var id = req.param('id'),
	currentUser = req.user,
	email = req.param('email');

	seneca.act({controller:'invitation',action:'create',currentUser:currentUser, email: email, propertyId:id},function(err,result){
		if(err){
			var status = err.status || 500;
			return res.status(status).json({err:err.err});
		}
		res.status(200).json({result:'sended'});
	});
});

app.get('/api/invitations/:key',authorization.is('User'),function(req,res,next){
	var key = req.param('key'),
	currentUser = req.user;

	seneca.act({controller:'invitation',action:'consume',currentUser:currentUser,key:key},function(err,result){
		if(err){
			var status = err.status || 500;
			return res.status(status).json({err:err.err});
		}
		res.status(200).json({result:'consumed'});
	});
});