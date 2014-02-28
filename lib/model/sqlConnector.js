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
	SP: "select name from sysobjects where name like '%SP_NAME%' and id in (select id from syscomments where text like '%exec%')order by [name]",
	SPSPEC:"select parameter_name as name, data_type as dataType, parameter_mode as type , character_maximum_length as maxlength from information_schema.parameters where specific_name = 'SP_NAME' "
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
				//console.dir(recordsets);
				callback(recordsets[0]);
				
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
	    setConfig:	function(con){
			config = con;
		},
		sendResult:	function(reportInfo, valuesArr,callback){
			if(typeof(reportInfo) === 'string' && spQueries[reportInfo]){
				var query = spQueries[reportInfo].replace("SP_NAME", valuesArr[0]);
				sendQueryResult(query, callback);
			}
			
		    else if(reportInfo.type ==="SP"){
				sendSpResult(reportInfo.sp.name, reportInfo.sp.params,valuesArr,callback);
			}

		}
	}
}