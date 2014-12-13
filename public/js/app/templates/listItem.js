define(['jade'], function(jade) { if(jade && jade['runtime'] !== undefined) { jade = jade.runtime; }

return function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<div class=\"row\"><div class=\"col-md-12 text-right btns\"><a id=\"btn-create\" class=\"btn btn-success\"><i class=\"fa fa-building-o\"></i><span>Crear Propiedad</span></a><a id=\"btn-cancel\" class=\"btn btn-danger\"><i class=\"fa fa-ban\"></i><span>Cancelar</span></a></div></div>");;return buf.join("");
}

});