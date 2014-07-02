function find (collec, query, callback) {
    mongoose.connection.db.collection(collec, function (err, collection) {
    collection.find(query).toArray(callback);
    });
}

seneca.add({controller:'entities',entity:'country', action:'list'},function(args,cb){
	find('countries',{},function(err,countries){
		if(err){
			console.log(err);
			seneca.act({model:'country',action:'error',when:'listed',data:data,error:err},cb);
			return;
		}
		cb(null,{countries:countries});
	})	
});