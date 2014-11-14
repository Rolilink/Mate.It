//Routes for Comments

app.post('/api/comments',authorization.is('User'),function(req,res,next){
	var data =  req.param('comment');
	data.user = req.user.id;
	seneca.act({controller:'comment',action:'create',data:data},function(err,result){
		if(err){
			var status = err.status || 500;
			return res.status(status).json({errors:err.errors});
		}


		res.status(201).json({comment:result.comment});

	})
});
 
 //returns the value of parameter 'id' brings back a specific comment of id: id
app.get('/api/comments/:id',function(req,res,next){
	seneca.act({controller:'comment',action:'get',id:req.param('id')},function(err,result){
		
		if(err){
			return res.status(500).json({err:err});
		}
		

		if(result.comment===null){
		return res.status(404).json({message:'Property does not exist'});
		}
		else{
			res.status(200).json({comment:result.comment});
		}
	});
});

//returns list of comments 
app.get('/api/comments',function(req,res,next){
	seneca.act({controller:'comment',action:'list',query:{},page:req.param('page'),limit:req.param('limit')},function(err,result){
		if(err){
			return res.status(500).json({err:err});
		}
		res.status(200).json({comments:result.comments});
	});
});

app.post('/api/comments/list',function(req,res,next){
	seneca.act({controller:'comment',action:'list',query:req.param('query'),page:req.param('page'),limit:req.param('limit')},function(err,result){
		if(err){
			return res.status(500).json({err:err});
		}
		res.status(200).json({comments:result.comments});
	});
});

//deletes comment of id: id brining back the parameter id
app.del('/api/comments/:id',authorization.is('Admin'),function(req,res,next){
	seneca.act({controller:'comment',action:'delete',id:req.param('id')},function(err,result){
		if(err){
			return res.status(500).json({err:err});
		}
		res.status(200).json({message:'deleted'});
	});
});

