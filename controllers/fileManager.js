/*
* File Controller
* @author Rolilink
*/

var fs = require('fs');


var readFile = function(filePath){
	var deferred = q.defer();

	fs.readFile(filePath,function(err,data){
		if(err)
			return deferred.reject(err);
		return deferred.resolve(data);
	});

	return deferred.promise;
};

var writeFile = function(pathName,data){
	var deferred = q.defer();

	fs.writeFile(pathName,data,function(err){
		if(err)
			return deferred.reject(err);
		return deferred.resolve(pathName);
	});

	return deferred.promise;
};


seneca.add({controller:'files',action:'upload'},function(args,cb){
	var readPath = args.readPath,
	writePath = args.writePath, 
	handleSuccess = function(data){ cb(null,{filePath:data}) },
	handleError = function(err){ cb(err,null) };

	readFile(readPath).then(function(data){ return writeFile(writePath,data); }).then(handleSuccess,handleError);	
});