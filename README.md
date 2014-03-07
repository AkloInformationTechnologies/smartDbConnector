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
```sh
    $ node index.js
    ```
If you like to auto restart server while modifing the code you can use nodemon. If not installed yet, you can install nodemon globally as follows.

```sh
    $ npm install -g nodemon
    ```
 To run using nodemon.   
```sh
    $ nodemon index.js
    ```
   
---
##Guideline
---
Asuming the node server is started in localhost:8888,

- systems

  To view the systems configurations
  
   ```js
   localhost:8888/systems
    ```
- services

  To view the already exposed services in a system
  
   ```js
   localhost:8888/[system Key]/services
   ex: localhost:8888/mdis/services
    ```
- sps

  To search the sps in the database of a system
  
   ```js
   localhost:8888/[system Key]/sps/[phrase of sp name]
   ex: localhost:8888/mdis/sps/studentdetails
   this will list down all the sps in the db, contains name is like 'studentdetails'
   output: 
   [{"schema":"dbo","name":"CM_SP_GetStudentDetailsByApplicationID"},{"schema":"dbo","name":"MC_RV_GetAllStudentDetails"}]
    ```
- spspec

  To inspect the parameters of a sp.Will list down all the parameters in a array.
  
   ```js
   localhost:8888//[system Key]/spspec/[sp name]
   ex: localhost:8888/mdis/spspec/CM_SP_GetStudentDetailsByApplicationID
   output:
   [{"name":"ApplicationID","dataType":"INT","direction":"IN","maxlength":null}]
    ```
- newservice

  To expose the sp as a service
  
   ```js
   localhost:8888/[system Key]/newservice/[service name]/[sp name]
   ex:localhost:8888/mdis/newservice/studentDetails/CM_SP_GetStudentDetailsByApplicationID
   output: 
   {"Result":"successfully added a new service as studentdetails"}
    ```
    
    
    Note: Now If you check the available services of system, you will be abale to see a new service is added with the name provided.
    ex: http://localhost:8888/mdis/services
    output:
    [{"name":"studentdetails"}]
    
- Inspect service
 
 To inspect the input parameters of a service
  
   ```js
   localhost:8888/[system Key]/[service name]/params
   ex: localhost:8888/mdis/studentdetails/params
   output: 
   [{"name":"ApplicationID","dataType":"INT","direction":"IN","maxlength":null}]
    ```
    To get the result from the service , parameters shoud be passed in the given order.
    
- Run service
 
 To run the service
  
   ```js
   localhost:8888/[system Key]/[service name]/["/" seperated params]
   ex: localhost:8888/mdis/studentdetails/100
   output: 
   details of the student with id 100 as a json result.
    ```
 
---    
##Tips

To run the server continuosly (to auto restart when down) you can use forever module. To install,

```sh
    $ npm install -g forever
    $ forever node index.js
    ```
    
Importent : Latest version of forever got issues when run in windows. If you are a windows user, install the following older version and run with -C.

```sh
    npm install -g forever@0.10.0
    forever node -C index.js
    ```
---
## Contribution
---

This project is still in alpha state and require lot of enhancements and modifications in security,caching, architecture and configuration with other databases. Need to test with mocha as well.

If anyone like to contribute you are warmly welcome. 



    
    


