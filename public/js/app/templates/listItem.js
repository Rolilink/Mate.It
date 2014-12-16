define(['jade'], function(jade) { if(jade && jade['runtime'] !== undefined) { jade = jade.runtime; }

return function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (property) {
buf.push("<div" + (jade.attr("data-id", property._id, true, false)) + " class=\"panel list-item\"><div class=\"panel-body\"><div class=\"col-md-4\"><div class=\"photo\">");
if ( property.photos.length > 0)
{
buf.push("<img" + (jade.attr("src", property.photos[0].url, true, false)) + " alt=\"\"/>");
}
else
{
buf.push("<img src=\"/img/default_property.png\"/>");
}
buf.push("</div><a" + (jade.attr("href", "/properties/" + property._id + "/view", true, false)) + " class=\"btn btn-primary\">Ver Detalles</a></div><div class=\"col-md-8\"><h4>" + (jade.escape(null == (jade_interp = property.title) ? "" : jade_interp)) + "</h4><p><span class=\"price\">" + (jade.escape(null == (jade_interp = property.price + "$ - ") ? "" : jade_interp)) + "</span><span class=\"left\">" + (jade.escape(null == (jade_interp = (1 + property.habitants.length) + " personas") ? "" : jade_interp)) + "</span></p>");
if ( property.description.length > 79)
{
buf.push("<p>" + (jade.escape(null == (jade_interp = property.description.substring(0,79) + " .....") ? "" : jade_interp)) + "</p>");
}
else
{
buf.push("<p>" + (jade.escape(null == (jade_interp = property.description) ? "" : jade_interp)) + "</p>");
}
buf.push("</div></div></div>");}.call(this,"property" in locals_for_with?locals_for_with.property:typeof property!=="undefined"?property:undefined));;return buf.join("");
}

});