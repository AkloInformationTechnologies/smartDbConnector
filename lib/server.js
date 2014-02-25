
var http = require("http");
var url = require("url");
var pathname = null;

function start(route) {
  function onRequest(request, response) {
    response.writeHead(200, {"Content-Type": "application/json"});
    pathname = url.parse(request.url).pathname;
    console.log("Request for " + pathname + " received.");
	route(pathname, function(result){
		response.write(JSON.stringify(result));
		response.end();
	});    
  }

  http.createServer(onRequest).listen(8888, "127.0.0.1");
  console.log("Server has started.");
}

exports.start = start;
