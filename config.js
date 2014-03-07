
module.exports = {
	"nodeServer":{
		host:"localhost",
		port:8888
	},
	"mongoConfigDbPath":"localhost:27017/smartDbConnector?auto_reconnect",
	"systems": {
		"VIDLO_GURU": {
				_id:"VIDLO_GURU",
				name: "Make better teacher - student connection" ,
				dbType:"MYSQL",
				config:{
					host: 'localhost',
					user: 'root',
					port:'3307',
					database: 'tution',
					password : "password123"
				}
		},
			
		"MDIS":{
				_id:"MDIS",
				name: "University management system",
				dbType:"SQL",
				config:{
					server: '173.21.23.95',
					user: 'sa',
					password : 'password123',
					database: 'MDIS_Development',
					options:{
						instanceName:"sql2008r2"
					}	
				}
		}
	},
	
	"logger": {
		"api": "logs/api.log",
		"exception": "logs/exceptions.log"
	}
};
