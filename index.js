var server = require("./lib/view/server");
var router = require("./lib/view/router");
var config = require("./config");
Global = {
	systems : config.systems,
	smartReports : {}
};

server.start(router.route);
