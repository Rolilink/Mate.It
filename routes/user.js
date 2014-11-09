
//req.body holds parameters that are sent up from the client as part of a post request.
app.post('/api/users',function(req,res,next){
	var file;

	if(req.files)
		file = req.files.profilepic;

	seneca.act({controller:'user',action:'create',data:req.body.user,file:file},function(err,result){
		if(err){
			if(err.name == "CastError")
				return res.status(422).json({err:err});

			return res.status(422).json({errors:err.errors});
		}
		res.status(result.status).json(result.response);
	});
});

//returns a list of users via a query
app.get('/api/users',authorization.is('User'),function(req,res,next){
	var page = req.param('page') || 1;
	seneca.act({controller:'user',action:'list',query:{},page:page,blacklist:'-password -emailKey -aId'},function(err,result){
		if(err){
			return res.status(500).json({err:err});
		}
		res.status(200).json({users:result.users,page:page});
	});
});

app.post('/api/users/list',authorization.is('User'),function(req,res,next){
	var page = req.param('page') || 1;
	seneca.act({controller:'user',action:'list',query:req.param('query'),page:page,limit:req.param('limit'),blacklist:'-password -emailKey -aId'},function(err,result){
		if(err){
			return res.status(500).json({err:err});
		}
		res.status(200).json({users:result.users,page:page});
	});
});

//returns the value of parameter 'id' brings back a specific user id: id
app.get('/api/users/:id',authorization.is('User'),function(req,res,next){
	seneca.act({controller:'user',action:'get',id:req.param('id'),blacklist:'-password -emailKey -aId'},function(err,result){
		if(err){
			if(err.name == "CastError")
				return res.status(422).json({err:err});

			if(err.name == "UserDontExist")
				return res.status(404).json({err:err});

			return res.status(500).json({err:err});
		}

		if(result.user===null)
		{
			res.status(404).json({message:'User does not exist'});	
		}
		else{
			res.status(200).json({user:result.user});
		}
		
	});
});
//works
app.del('/api/users/:id',authorization.is('Self'),function(req,res,next){
	seneca.act({controller:'user',action:'delete',id:req.param('id'),blacklist:'-password -emailKey -aId'},function(err,result){
		if(err){
			console.log(err);
			if(err.name == "CastError")
				return res.status(422).json({err:err});

			if(err.name == "UserNotFound")
				return res.status(404).json({err:err});

			return res.status(500).json({err:err});
		}

		if(result.user===null)
		{
			res.status(404).json({message:'User does not exist'});	
		}

		res.status(200).json({user:{id:req.param('id')}});
	});
});

app.post('/api/users/:id',authorization.is('Self'),function(req,res,next){
	var file;

	if(req.files)
		file = req.files.profilepic;
	
	seneca.act({controller:'user',action:'update',data:req.param('user'),id:req.param('id'),file:file,blacklist:'-password -emailKey -aId'},function(err,result){
		if(err){
			if(err.name == "CastError")
				return res.status(422).json({err:err});

			if(err.name == "UserDontExist")
				return res.status(404).json({err:err});

			return res.status(422).json({errors:err.errors});
		}
		res.status(200).json(result);
	});
});

app.post('/api/users/:id/profilepic',authorization.is('Self'),function(req,res){
	var id = req.param('id'),
	picture = req.files.picture;	
	seneca.act({controller:"user",action:"editProfilePicture",id:id,picture:picture,blacklist:'-password -emailKey -aId'},function(err,result){
		if(err)
			return res.status(500).json({err:err});
		res.status(200).json({picture:result});
	});
});

app.post('/api/users/:id/property/:propid',authorization.is('Self'),function(req,res){
	var id = req.param('id'),
			propid = req.param('propid');
			seneca.act({controller:"user",action:"addProperty", id:id, propid:propid,blacklist:'-password -emailKey -aId'},function(err,result){
				if(err)
					return res.status(500).json({err:err});
				res.status(200).json({user:result});
			});
});

app.del('/api/users/:id/property',authorization.is('Self'),function(req,res){
	var id = req.param('id');
			seneca.act({controller:"user",action:"removeProperty", id:id,blacklist:'-password -emailKey -aId'},function(err,result){
				if(err)
					return res.status(500).json({err:err});
				res.status(200).json({user:result});
			});
});

app.post('/log/files',function(req,res){
	console.log(req.files);
});