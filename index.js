var server = require("./lib/server");
var router = require("./lib/router");
Global = {
	systems : {},
	smartReports : {}
};

server.start(router.route);
