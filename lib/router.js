 
var dbHandler = require("./dbHandler").load();
var systemName = null;
var reportName = null;

function route(pathName,callback) {
  console.log(pathName)
  pathName = pathName.trim().split("/");
  if(pathName.length > 1)
  {
	systemName = pathName[1].trim().toUpperCase();
	if(pathName.length > 2){
		reportName = pathName[2].trim().toLowerCase();
		dbHandler.sendResults(systemName,reportName, [pathName[3].trim()] , callback);
	}
	else{
		callback({Error: "Report name is not found."});
	}
  }
}

exports.route = route;