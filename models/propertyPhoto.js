var Schema = new mongoose.Schema({
	pictureKey:{type:String,unique:true},
	//property:{type:}
});

Schema.pre("",function(){
	
});

var paginate = require('./plugins/paginate');
Schema.plugin(paginate);
module.exports = Schema;