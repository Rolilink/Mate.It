var Schema = new mongoose.Schema({
	content:String,
  creator:String,
  property:String
});

var paginate = require('./plugins/paginate');
Schema.plugin(paginate);
module.exports = Schema;