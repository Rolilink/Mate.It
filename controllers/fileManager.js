var fs = require('fs');

seneca.add({controller:'files',action:'upload'},function(args,cb){
	console.log("copying file");
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
			console.log("file copied");
			cb(null,{path:newPath});
		});
	});
});