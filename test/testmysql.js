var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  database: 'test',
  password : null
});

connection.connect();

connection.query('select * from teacher', function(err, rows, fields) {
  if (err) throw err;

  console.log('The solution is: ', rows);
});