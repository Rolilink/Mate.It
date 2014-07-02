
//req.body holds parameters that are sent up from the client as part of a post request.
app.post('/api/users',function(req,res,next){
	var file;

	if(req.files)
		file = req.files.profilepic;

	seneca.act({controller:'user',action:'create',data:req.body,file:file},function(err,result){
		if(err){
			return res.status(500).json({err:err});
		}
		res.status(200).json({id:result.user._id});
		
	});
});

//returns a list of users via a query
app.get('/api/users',function(req,res,next){
	var page = req.param('page') || 1;
	seneca.act({controller:'user',action:'list',query:{},page:page},function(err,result){
		if(err){
			return res.status(500).json({err:err});
		}
		res.status(200).json({users:result.users,page:page});
	});
});

app.post('/api/users/list',function(req,res,next){
	var page = req.param('page') || 1;
	seneca.act({controller:'user',action:'list',query:req.param('query'),page:page},function(err,result){
		if(err){
			return res.status(500).json({err:err});
		}
		res.status(200).json({users:result.users,page:page});
	});
});

//returns the value of parameter 'id' brings back a specific user id: id
app.get('/api/users/:id',function(req,res,next){
	seneca.act({controller:'user',action:'get',id:req.param('id')},function(err,result){
		if(err){
			return res.status(500).json({err:err});
		}

		if(result.user===null)
		{
			console.log("result of user ",result.user);
			res.status(404).json({message:'User does not exist'});	
		}
		else{
			res.status(200).json({user:result.user});
		}
		
	});
});

app.del('/api/users/:id',function(req,res,next){
	seneca.act({controller:'user',action:'delete',id:req.param('id')},function(err,result){
		if(err){
			return res.status(500).json({err:err});
		}
		res.status(200).json({message:'deleted'});
	});
});

app.post('/api/users/:id',function(req,res,next){
	var file;

	if(req.files)
		file = req.files.profilepic;
	
	seneca.act({controller:'user',action:'update',data:req.body,id:req.param('id'),file:file},function(err,result){
		if(err){
			return res.status(500).json({err:err});
		}
		res.status(200).json({message:'updated'});
	});
});