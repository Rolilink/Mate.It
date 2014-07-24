/* 
 * Comments Controller
 * @author: Rolilink
 */

//Promises

// Find Comment Function Wrapped in a Promise
var findComment = function(id){
 	var deferred = q.defer();
 	
 	Comment.findById(id,function(err,comment){
 		if(err)
 			return deferred.reject(err);
 		return deferred.resolve(comment);
 	});

 	return deferred.promise;
};

// List Paginated Comments Function Wrapped in a Promise
var findComments = function(query,attr,page,limit){
	var deferred = q.defer();
	Comment.findPaginated(query,attr,page,limit).lean().exec(function(err,comments){
		if(err)
			return deferred.reject(err);
		return deferred.resolve(comments);
	});
	return deferred.promise;
}

// Save Comment Function Wrapped in a Promise
var saveComment = function(comment){
	var deferred = q.defer();
	comment.save(function(err){
		if(err)
			return deferred.reject(err);
		return deferred.resolve(comment);
	});
	return deferred.promise
}

//Delete Comment Function
var deleteComment = function(comment){
	var deferred = q.defer();
	comment.remove(function(err,comment){
		if(err)
			return deferred.reject(err);
		return deferred.resolve(comment);
	});
	return deferred.promise
}

// Seneca Micro Services
seneca.add({controller:'comment',action:'create'},function(args,cb){
	var data = args.data,
	handleSuccess = function(data){ cb(null,{comment:data}); },
	handleError = function(err){	cb(err,null); };

	var createdComment = new Comment(data);
	saveComment(createdComment).then(handleSuccess,handleError);
});

seneca.add({controller:'comment',action:'get'},function(args,cb){
	var id = args.id,
	handleSuccess = function(data){ cb(null,{comment:data}); },
	handleError = function(err){	cb(err,null); };

	findComment(id).then(handleSuccess,handleError);
});

seneca.add({controller:'comment',action:'list'},function(args,cb){
	var page = args.page || 1,
	query = args.query || {},
	limit = args.limit || 20,
	handleSuccess = function(data){ cb(null,{comments:data}); },
	handleError = function(err){	cb(err,null); };

	findComments(query,'',page,limit).then(handleSuccess,handleError);
});

seneca.add({controller:'comment',action:'delete'},function(args,cb){
	var id = args.id,
	handleSuccess = function(data){ cb(null,{comment:data}); },
	handleError = function(err){	cb(err,null); };

	findComment(id).then(deleteComment).then(handleSuccess,handleError);
});

// Not Used Right Now
seneca.add({controller:'comment',action:'update'},function(args,cb){
	var data = args.data,
	id = args.id,
	handleSuccess = function(data){ cb(null,{comment:data}); },
	handleError = function(err){	cb(err,null); },
	updateComment = function(comment){ return _.extend(comment,data); };

	findComment(id).then(updateComment).then(saveComment).then(handleSuccess,handleError);
});
