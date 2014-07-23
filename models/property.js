var validate = require('mongoose-validator').validate,
troop = require('mongoose-troop'),
fs = require('fs'),
path  = require('path'),
uuid = require('node-uuid');

//TODO: Ownership relationship - Owner Field
//TODO: Habitant relationship - Habitants Field
//TODO: PropertyPhoto relationship - Photos Field


var Schema = new mongoose.Schema({
	capacity:{type:Number,min:1}, //ok
	available:{type:Boolean,default:true}, //ok
	country:{type:String}, //ok
	address:{type:String,unique:true,validate:[validate('len',10,70)]}, //ok
	longitude:{type:Number,min:-180,max:180}, //ok
	lattitude:{type:Number,min:-90,max:90}, //ok
	price:{type:Number,min:100},
	createdAt:{type:Date,default:Date.now()},//ok
	roomType:{type:String,enum:['private','shared']}, //ok
	propertyType:{type:String,enum:['apartment','house','other']}, //ok
	headLine:{type:String,validate:[validate('len',10,60)]},
	description:{type:String,validate:[validate('len',10,500)]}, //ok 
	title:{type:String}, // ok
	photos:[{url:String}]
});	

Schema.methods.addPicture = function(file){
	var deferred = q.defer(),
	readPath = file.path,
	fileName = uuid.v1()+ path.extname(file.originalFilename),
	uploadPath = appRoot + "/public/uploads/properties/" + fileName,
	self = this;

	if( ! /image/.test(file.headers['content-type']) ){
    deferred.reject("file is not an image.");
    return deferred.promise;
  }

  seneca.act({controller:'files',action:'upload', readPath: readPath, writePath: uploadPath},function(err,result){
  	console.log(result);
  	if(err)
  		return deferred.reject(err);
  	var filePath = path.relative(app.get("publicdir"),result.filePath);
    self.photos.push({url:filePath});
    deferred.resolve(self);	
  });
	
	return deferred.promise;
};

Schema.methods.getPicture = function(){

}

Schema.methods.removePicture = function(){

}

Schema.methods.listPictures = function(){
	return this.photos;
}

Schema.plugin(troop.timestamp);
var paginate = require('./plugins/paginate');
Schema.plugin(paginate);
Schema.plugin(troop.timestamp); //ok
module.exports = Schema;
