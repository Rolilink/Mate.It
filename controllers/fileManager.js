var fs = require('fs');

seneca.add({controller:'files',action:'upload'},function(args,cb){
	var file = args.file,
	destFolder = appRoot + "/public/uploads/" + args.destFolder
	fileName = args.fileName;

	fs.readFile(args.file.path, function(err,data){
		if(err)
			cb(err);

		var newPath = destFolder + "/" + fileName;
		fs.writeFile(newPath,data, function(err){
			if(err)
				cb(err);
			cb(null,{path:newPath});
		});
	});
});