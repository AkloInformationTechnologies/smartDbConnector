/** Sample Config **/
/**
var config = {
    user: 'sa',
    password: '1qaz2wsx@',
    server: '172.21.25.90',
    database: 'MDIS_Development_Live',
	options:{
	instanceName: 'sql2008r2'
  }
}

**/

var sql = require('mssql'); 
var DataType = {
	INT : sql.Int
}
exports.load = function(){
	return new SqlConnector();
}

function SqlConnector(){
    var config = null;
	
	function sendSpResult(spName, params,values,callback){
	    console.log("SP Name : " + spName );
		sql.connect(config, function(err) {
			if(err){
					console.log("SQL connect error: " + err);
			}
			// Stored Procedure
			var request = new sql.Request();
			if(params && params.length>0)
			{
			    console.log("Report Params: " + params);
				for(var i = 0; i<params.length; i++){
					if(params[i].direction.toUpperCase() === "INPUT"){
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
				console.dir(recordsets);
				callback(recordsets[0]);
			});

		});
	}
		
	function sendQueryResult(queryString, params, callback){
		sql.connect(config, function(err) {
			if(err){
					console.log(err);
			}
			var request = new sql.Request();
			request.query(queryString, function(err, recordset) {
				if(err){
					console.log(err);
				}
				console.dir(recordset);
				callback(recordsets[0]);
			});

		});
			
	}
	
	return{
	    setConfig:function(con){
			config = con;
		},
		sendResult:function(reportInfo, valuesArr,callback){
		    if(reportInfo.type ==="SP"){
				sendSpResult(reportInfo.sp.name, reportInfo.sp.params,valuesArr,callback);
			}

		}
	}
}