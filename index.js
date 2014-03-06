var server = require("./lib/view/server");
var router = require("./lib/view/router");

server.start(router.route);
