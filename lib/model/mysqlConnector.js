
var mysql      = require('mysql');
var spQueries = {
	SPS: "select name from mysql.proc  where  Db = 'DATABASE_NAME' and name like '%SP_NAME%'",
	SP_EXACT: "select name from mysql.proc  where  Db = 'DATABASE_NAME' and name  = 'SP_NAME'",
	SPSPEC:"SELECT PARAMETER_NAME as name, DATA_TYPE as dataType, CHARACTER_MAXIMUM_LENGTH as maxlength, PARAMETER_MODE as direction FROM information_schema.parameters WHERE specific_name = 'SP_NAME' "
} 

exports.load = function(){
	return new MySqlConnector();
}

function MySqlConnector(){
    var config = null;
	var connection = null;
	var systemName = null;
	var that = this;
	
	function createService(serviceName, spName, callback){
		if(spName === ""){
			callback({Error:"sp name is not provided"});
		}
		else{
			var query = spQueries["SP_EXACT"].replace("DATABASE_NAME", config.database).replace("SP_NAME", spName);
			sendQueryResult(query, function(spInfo){
				if(spInfo.length === 0){
					callback({Error: "No sp is found for " + spName + " in the system."});
				}
				else if(spInfo && spInfo.length === 1){
					exposeSpAsWebService(serviceName, spInfo[0], callback);
				}
				else if (spInfo.length > 1){
					callback({Error: "More than one result is found for " + spName + " in the system.", result:spInfo});
				}
				
			});
		}
	}
	
	function exposeSpAsWebService(serviceName, spInfo, callback){
		var spNameWithSchema = spInfo.name ; 
		var query = spQueries["SPSPEC"].replace("SP_NAME", spInfo.name);
		
		
		sendQueryResult(query, function(spParamsInfo){
			Services.insert({
				"name":serviceName,
				"type":"SP",
				"system":that.systemName,
				"sp":{
					"name":spNameWithSchema,
					"params":spParamsInfo
				}
				
			}, function (err, result) {
				if(result){
					callback({ Result: "successfully added new service for " + serviceName});
				}
				else{
					callback({ Error: "Error occured while creating new service " + serviceName});
				}
			});
		});
	}
	
	function sendSpResult(spName, params,values,callback){
	    var valueInputs = "";
		for(var i =0; i<values.length; i++){
			valueInputs += values[i] + "," ;
		}
		valueInputs = (valueInputs.length > 0) ? valueInputs.substr(0, valueInputs.length -1 ): "";
		var queryString = "CALL " + config.database + "." + spName + "(" + valueInputs + ")" ;
		connection.query(queryString, function(err, rows, fields) {
			if (err) throw err;

			callback(rows[0]);
		});
	}
	
		
	function sendQueryResult(queryString, callback){
		connection.query(queryString, function(err, rows, fields) {
			if (err) throw err;

			callback(rows);
		});
			
	}
	
	return{
	    setConfig:function(sytemName, con){
			config = con;
			that.systemName = sytemName;
			connection = mysql.createConnection(con);
			connection.connect();
		},
		sendResult:function(reportInfo, valuesArr,callback){
		   
			if(typeof(reportInfo) === 'string' && reportInfo ==="NEWSERVICE"){
				//callback({Result:that.systemName});
				createService(valuesArr[0], valuesArr[1].trim(), callback);
			}
			else if(typeof(reportInfo) === 'string' && spQueries[reportInfo]){
				var query = spQueries[reportInfo].replace("DATABASE_NAME", config.database).replace("SP_NAME", valuesArr[0]);
				sendQueryResult(query, callback);
			}
		    else if(reportInfo.type ==="SP"){
				sendSpResult(reportInfo.sp.name, reportInfo.sp.params,valuesArr,callback);
			}
			else if(reportInfo.type ==="QUERY"){
				sendQueryResult(reportInfo.query.string, reportInfo.query.params,valuesArr,callback);
			}
			
		}
	}
}