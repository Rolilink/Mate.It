var validate = require('mongoose-validator').validate,
troop = require('mongoose-troop'),
fs = require('fs'),
path  = require('path');

//TODO: Ownership relationship - Owner Field
//TODO: Habitant relationship - Habitants Field
//TODO: PropertyPhoto relationship - Photos Field


var Schema = new mongoose.Schema({/*
	capacity:{type:Number,required:true,min:1}, //ok
	available:{type:Boolean,required:true,default:true}, //ok
	country:{type:String,required:true}, //ok
	address:{type:String,unique:true,required:true,validate:[validate('len',10,70)]}, //ok
	longitude:{type:Number,required:true,min:-180,max:180}, //ok
	lattitude:{type:Number,required:true,min:-90,max:90}, //ok
	price:{type:Number,required:true,min:100},
	createdAt:{type:Date,default:Date.now()},//ok
	roomType:{type:String,required:true,enum:['private','shared']}, //ok
	propertyType:{type:String,required:true,enum:['apartment','house','other']}, //ok
	headLine:{type:String,required:true,validate:[validate('len',10,60)]},
	description:{type:String,required:true,validate:[validate('len',10,500)]}, //ok
	title:{type :String,required:true} // ok */
});


Schema.plugin(troop.timestamp);
var paginate = require('./plugins/paginate');
Schema.plugin(paginate);
Schema.plugin(troop.timestamp); //ok
module.exports = Schema;
