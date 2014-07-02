require("fs").readdirSync("./routes").forEach(function(file) {
  if(file != "index.js")
  	require("./" + file);
});