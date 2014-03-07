smartDbConnector
================

This node project allows to expose stored procedures of relational databases as restful web services on the fly. This will be useful if you want to expose hundreds of sps in a system to outside, since no additional coding is required.

This version support for mysql and sql server. A Mongodb collection is used to map the services with sps.

##To begin
---

1. Install nodejs (http://nodejs.org/download/)
2. Install mongodb (http://www.mongodb.org/downloads)
3. Clone the project to your pc.(git clone https://github.com/AkloInformationTechnologies/smartDbConnector.git) or download the zip file.

## Quick Start
---
###Configuration

All the configurations required to run the project are mentioned in the config.js file. You can change the parameters to as need.

- Set the nodejs server and port
 
  ```js
    "nodeServer":{
    	host:"localhost",
		port:8888
	},
    ```
node server will be up in the host and port mentioned in here.

- MongoDb config
 ```js
   "mongoConfigDbPath":"localhost:27017/smartDbConnector?auto_reconnect",
    ```
A db called smartDbConnector will be used to map the services. A db will be automatially created at the first run. All the service configs will be availabe in a collection called services in this db.

- Add Systems
    
    You can add any number of systems as follows. First system "VIDLO_GURU" shows a system integrated with mysql database and second one shows sql server integration. 
 ```js
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
    ```
    
    You can change the key, _id and config section to match with your system.(Password encription functionality will be introduced in future.)

    Note: In mysql phpmyadmin default password is null. No need to mention port.
    
###Start Server

start the mongodb server and then start node server as follows.

    $ node index.js
    
If you like to auto restart server while modifing the code you can use nodemon. If not installed yet, you can install nodemon globally as follows.


    $ npm install -g nodemon
    
 To run using nodemon.   

    $ nodemon index.js
    
   
---