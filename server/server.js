var express = require('express');
var cors = require('cors');
var app = express();
var port = process.env.PORT || 3000;

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(cors());

var sqlite3 = require('sqlite3').verbose();
var db_filename = 'database.sqlite3';
var db = new sqlite3.Database(db_filename, function() {
	db.serialize(function() {
		db.run("CREATE TABLE IF NOT EXISTS transactions (date TEXT, name TEXT, amount NUM)");
	});
});

app.get('/api', function(req, res) {
	db.all("SELECT date, name, amount, Categories.category FROM transactions LEFT JOIN Categories ON transactions.CategoryId = Categories.Id", function(err, rows) {
		res.send(rows);
	});
	console.log('Getting Transactions!');
});

app.get('/api/categories', function(req, res) {
	db.all("SELECT category FROM Categories", function(err, rows) {
		res.send(rows);
	});
	console.log('Getting Categories!');
});

app.get('/api/:id', function(req, res) {
	db.get("SELECT * FROM transactions WHERE rowid=?",req.params.id, function(err, row) {
		res.send(row);
	});
});

app.post('/api', function(req, res) {
	console.log("You deposited " + req.body.amount + " on " + req.body.date + "!");
	db.run("INSERT INTO transactions VALUES (?, ?, ?)", req.body.date, req.body.description, req.body.amount);
	res.send(req.body);
});

// Gracefully shut down server. Closes db connection. 
process.on('SIGINT', function() {
	console.log('\nClosing connections and shutting down');
	db.close();
	console.log('Server shut down gracefully');
	process.exit(0);
});

server = app.listen(port, function() {
	console.log('Server started on port ' + port);
});
