app.post('/api/users/:id/profilepic',function(req,res){
	var id = req.param('id'),
			picture = req.files.picture;	
	
	seneca.act({controller:"profilePicture",action:"create",id:id,picture:picture},function(err,result){
		if(err)
			return res.status(500).json({err:err});
		res.status(200).json({picture:result});
	});

});