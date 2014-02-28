
var mysql      = require('mysql');

exports.load = function(){
	return new MySqlConnector();
}

function MySqlConnector(){
    var config = null;
	var connection = null;
	
	function sendSpResult(spName, params,values,callback){
		
	}
		
	function sendQueryResult(queryString, params,values, callback){
		connection.query(queryString, function(err, rows, fields) {
			if (err) throw err;

			callback(rows);
		});
			
	}
	
	return{
	    setConfig:function(con){
			config = con;
			connection = mysql.createConnection(con);
			connection.connect();
		},
		sendResult:function(reportInfo, valuesArr,callback){
		    if(reportInfo.type ==="QUERY"){
				sendQueryResult(reportInfo.query.string, reportInfo.query.params,valuesArr,callback);
			}

		}
	}
}