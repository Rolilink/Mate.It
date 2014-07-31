var Schema = new mongoose.Schema({
	content:String,
  creator:{type:mongoose.Schema.Types.ObjectId, ref:'User'},
  property:{type:mongoose.Schema.Types.ObjectId, ref:'Property'}
});

var paginate = require('./plugins/paginate');
Schema.plugin(paginate);
module.exports = Schema;