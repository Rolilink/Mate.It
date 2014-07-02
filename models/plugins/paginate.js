var findPaginate = function(query,fields,page,limit){
	return this.find(query,fields).skip((page - 1) * limit).limit(limit);
};

module.exports = function paginate(schema,options){
	schema.statics.findPaginated = findPaginate;
}