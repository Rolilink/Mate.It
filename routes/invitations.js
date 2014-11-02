app.post('/api/properties/:id/invite',authorization.is('Owner'),function(req,res,next){
	var id = req.param('id'),
	currentUser = req.user,
	email = req.param('email');

	seneca.act({controller:'invitation',action:'create',currentUser:currentUser, email: email, propertyId:id},function(err,result){
		if(err){
			return res.status(500).json({err:err});
		}
		if(result.err)
			return res.status(result.status).json({err:result.err});
		res.status(result.status).json({response:result.response});
	});
});

app.get('/api/invitations/:key',authorization.is('User'),function(req,res,next){
	var key = req.param('key'),
	currentUser = req.user;

	seneca.act({controller:'invitation',action:'consume',currentUser:currentUser,key:key},function(err,result){
		if(err){
			return res.status(500).json({err:err.err});
		}
		res.status(result.status).json({response:result.response});
	});
});