 
var dbHandler = require("../controller/dbHandler").load();
var systemName = null;
var reportName = null;

function route(pathName,callback) {
  console.log(pathName)
  pathName = pathName.trim().replace("%20", " ").split("/");
  if(pathName.length > 1)
  {
	systemName = pathName[1].trim().toUpperCase();
	if(pathName.length > 2 && pathName[2].trim() != ""){
		var dbParams = [];
		reportName = pathName[2].trim().toLowerCase();
		if(pathName.length >= 3){
			for(var i = 3 ; i< pathName.length; i++){
				dbParams.push(pathName[i].trim());
			}
		}
		//callback(dbParams);
		dbHandler.sendResults(systemName,reportName, dbParams , callback);
	}
	else if(systemName === "SYSTEM"){
		dbHandler.sendSystems(callback);
	}
	else{
		callback({Error: "Report name is not found."});
	}
  }
}

exports.route = route;