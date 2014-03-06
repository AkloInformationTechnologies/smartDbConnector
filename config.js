
module.exports = {
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
					password : "*19vidloguru*"
				}
			},
			
		"MDIS":{
				_id:"MDIS",
				name: "University management system",
				dbType:"SQL",
				config:{
					server: '172.21.25.90',
					user: 'sa',
					password : '1qaz2wsx@',
					database: 'MDIS_Development_Live',
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
