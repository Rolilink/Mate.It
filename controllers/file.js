/*
* File Controller
* @author Rolilink
*/

var fs = require('fs');


var readFile = function(filePath){
	var deferred = q.defer();
	console.log('reading file:' + filePath);
	fs.readFile(filePath,function(err,data){
		if(err)
			return deferred.reject(err);

		console.log('file readed:' + filePath);
		return deferred.resolve(data);
	});

	return deferred.promise;
};

var writeFile = function(pathName,data){
	var deferred = q.defer();
	console.log('writting file:' + pathName);
	fs.writeFile(pathName,data,function(err){
		if(err)
			return deferred.reject(err);
		console.log('file wrote:' + pathName);
		return deferred.resolve(pathName);
	});

	return deferred.promise;
};

var removeFile = function(filePath){
	var deferred = q.defer();
	fs.unlink(filePath,function(err){
		if(err)
			return deferred.reject(err);
		console.log('file removed:' + filePath);
		return deferred.resolve(filePath);
	});
	return deferred.promise;
}

seneca.add({controller:'files',action:'upload'},function(args,cb){
	var readPath = args.readPath,
	writePath = args.writePath, 
	handleSuccess = function(data){ cb(null,{filePath:data}); },
	handleError = function(err){ cb(null,err); };
	readFile(readPath).then(function(data){ return writeFile(writePath,data); }).then(handleSuccess,handleError);	
});

seneca.add({controller:'files',action:'delete'},function(args,cb){
	var filePath = args.filePath,
	handleSuccess = function(data){ cb(null,{filePath:data}); },
	handleError = function(err){ cb(null,err); };

	removeFile(filePath).then(handleSuccess,handleError);
});