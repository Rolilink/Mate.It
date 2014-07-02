app.get('/api/entities/countries',function(req,res,next){
	seneca.act({controller:'entities',entity:'country',action:'list'},function(err,result){
		if(err) return res.status(500);
		return res.status(200).json(result.countries);
	});
})