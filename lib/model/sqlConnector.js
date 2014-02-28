/** Sample Config **/
/**
var config = {
    user: 'sa',
    password: 'password',
    server: 'localhost',
    database: 'DbName',
	options:{
	instanceName: 'sql2008r2'
  }
}

**/

var sql = require('mssql');
var spQueries = {
	SP: "select specific_schema as [schema], specific_name as name from information_schema.routines where routine_type = 'PROCEDURE' and specific_name like '%SP_NAME%'",
	SP_EXACT: "select specific_schema as [schema], specific_name as name from information_schema.routines where routine_type = 'PROCEDURE' and specific_name = 'SP_NAME'",
	SPSPEC:"select substring(parameter_name,2,len(parameter_name)) as name, upper(data_type) as dataType, parameter_mode as direction , character_maximum_length as maxlength from information_schema.parameters where specific_name = 'SP_NAME' "
} 
var DataType = {
	INT :sql.Int,
	BIT:sql.Bit,
	BIG_INT:sql.BigInt,
	DECIMAL:sql.Decimal,
	FLOAT:sql.Float,
	MONEY:sql.Money,
	NUMERIC:sql.Numeric,
	SMALL_INT:sql.SmallInt,
	SMALL_MONEY:sql.SmallMoney,
	REAL:sql.Real,
	TINY_INT:sql.TinyInt,
	CHAR:sql.Char,
	NCHAR:sql.NChar,
	TEXT:sql.Text,
	NTEXT:sql.NText,
	VARCHAR:sql.VarChar,
	NVARCHAR:sql.NVarChar,
	XML:sql.Xml,
	DATE:sql.Date,
	DATETIME:sql.DateTime,
	DATETIME_OFFSET:sql.DateTimeOffset,
	SMALL_DATETIME:sql.SmallDateTime,
	UNIQUE_IDENTIFIER:sql.UniqueIdentifier,
	BINARY:sql.Binary,
	VAR_BINARY:sql.VarBinary,
	IMAGE:sql.Image
}

exports.load = function(){
	return new SqlConnector();
}

function SqlConnector(){
    var config = null;
	var systemName = null;
	var that = this;
	
	function sendSpResult(spName, params,values,callback){
	    //console.log("SP Name : " + spName );
		//callback(values);
		sql.connect(config, function(err) {
			if(err){
					console.log("SQL connect error: " + err);
			}
			// Stored Procedure
			var request = new sql.Request();
			if(params && params.length>0)
			{
			    //console.log("Report Params: " + params);
				for(var i = 0; i<params.length; i++){
					if(values[i].toLowerCase() === "null"){
						values[i] = null;
					}
					if(params[i].direction.toUpperCase() === "IN"){
						request.input(params[i].name, DataType[params[i].dataType], values[i]);
					}
					else{
						request.output(params[i].name, DataType[params[i].dataType]);
					}
				}
			}
			request.execute(spName, function(err, recordsets, returnValue){
				if(err){
					console.log(err);
				}
				//console.dir(recordsets);
				callback(recordsets[0]);
				
			});

		});
	}
	
	function createService(serviceName, spName, callback){
		if(spName === ""){
			callback({Error:"sp name is not provided"});
		}
		else{
			var query = spQueries["SP_EXACT"].replace("SP_NAME", spName);
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
		var spNameWithSchema = "[" + spInfo.schema + "].[" + spInfo.name + "]" ; 
		var query = spQueries["SPSPEC"].replace("SP_NAME", spInfo.name);
		
		sendQueryResult(query, function(spParamsInfo){
			//console.log(Reports);
			//callback(config);
			Reports.insert({
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
	
	function sendQueryResult(queryString, callback){
		sql.connect(config, function(err) {
			if(err){
					console.log(err);
			}
			var request = new sql.Request();
			request.query(queryString, function(err, recordset) {
				if(err){
					console.log(err);
				}
				//console.dir(recordset);
				callback(recordset);
			});

		});
			
	}

	
	return{
	    setConfig:	function(systemName,con){
			config = con;
			that.systemName = systemName;
			//console.log("system: " + systemName);
		},
		sendResult:	function(reportInfo, valuesArr,callback){
			if(typeof(reportInfo) === 'string' && reportInfo ==="NEWSERVICE"){
				//callback({Result:that.systemName});
				createService(valuesArr[0], valuesArr[1].trim(), callback);
			}
			else if(typeof(reportInfo) === 'string' && spQueries[reportInfo]){
				var query = spQueries[reportInfo].replace("SP_NAME", valuesArr[0]);
				sendQueryResult(query, callback);
			}
		    else if(reportInfo.type ==="SP"){
				sendSpResult(reportInfo.sp.name, reportInfo.sp.params,valuesArr,callback);
			}

		}
	}
}