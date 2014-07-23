//Routes for Property
//req.body holds parameters that are sent up from the client as part of a post request.
app.post('/api/properties',function(req,res,next){
	seneca.act({controller:'property',action:'create',data:req.body},function(err,result){
		if(err){
			return res.status(500).json({err:err});
		}
		res.status(200).json({id:result.property._id});

	})
});
 
 //returns the value of parameter 'id' brings back a specific property of id: id
app.get('/api/properties/:id',function(req,res,next){
	seneca.act({controller:'property',action:'get',id:req.param('id')},function(err,result){
		
		if(err){
			return res.status(500).json({err:err});
		}
		

		if(result.property===null){
		console.log("result of property ",result.property);
		return res.status(404).json({message:'Property does not exist'});
		}
		else{
			res.status(200).json({property:result.property});
		}
	});
});

//returns list of properties 
app.get('/api/properties',function(req,res,next){
	seneca.act({controller:'property',action:'list',query:{},page:req.param('page'),limit:req.param('limit')},function(err,result){
		if(err){
			return res.status(500).json({err:err});
		}
		res.status(200).json({properties:result.properties});
	});
});

app.post('/api/properties/list',function(req,res,next){
	seneca.act({controller:'property',action:'list',query:req.param('query'),page:req.param('page'),limit:req.param('limit')},function(err,result){
		if(err){
			return res.status(500).json({err:err});
		}
		res.status(200).json({properties:result.properties});
	});
});

//deletes property of id: id brining back the parameter id
app.del('/api/properties/:id',function(req,res,next){
	seneca.act({controller:'property',action:'delete',id:req.param('id')},function(err,result){
		if(err){
			return res.status(500).json({err:err});
		}
		res.status(200).json({message:'deleted'});
	});
});

//updates property of id:id bringing back the parameter of id, then sends back the object.
app.post('/api/properties/:id',function(req,res,next){
	seneca.act({controller:'property',action:'update',data:req.param('property'),id:req.param('id')},function(err,result){
		if(err){
			return res.status(500).json({err:err});
		}
		res.status(200).json({message:'updated'});
	});
});

app.post('/api/properties/:id/photos',function(req,res,next){
	var picture = req.files.picture,
	id = req.param('id');

	seneca.act({controller:"property", action:"addPicture",id:id, picture:picture},function(err,result){
		if(err){
			return res.status(500).json({err:err});
		}
		res.status(200).json({picture:result.picture});
	});
});

app.get('/api/properties/:id/photos',function(req,res,next){
	var id = req.param('id');

	seneca.act({controller:'property',action:'listPictures',id:id},function(err,result){
		if(err){
			return res.status(500).json({err:err});
		}
		res.status(200).json({pictures:result.pictures});
	});
});

app.del('/api/properties/:id/photos/:photoid',function(req,res,next){
	var id = req.param('id'),
	pictureId = req.param('photoid');

	seneca.act({controller:'property',action:'deletePicture',id:id, pictureId:pictureId},function(err,result){
		if(err){
			return res.status(500).json({err:err});
		}
		res.status(200).json({deleted:result.deleted});
	});
});

app.get('/test',function(req,res,next){
	res.sendfile('post.html',function(){

	});
});
