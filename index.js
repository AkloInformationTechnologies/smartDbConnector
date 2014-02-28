var server = require("./lib/view/server");
var router = require("./lib/view/router");
Global = {
	systems : {},
	smartReports : {}
};

server.start(router.route);
