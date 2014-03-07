// App configuration.
var application_root = __dirname;
var express = require('express'),
	mongo = require('mongodb'),
	path = require('path'),
	character = require('./routes/characters');

// Configuration values.
var port = 4200,
	dbServer = 'localhost',
	dbPort = 27017,
	dbName = 'codex-principia',
	collections = [
		'characters'
	]

// Connecting to the database.
var server = new mongo.Server(dbServer, dbPort, {auto_reconnect: true});
db = new mongo.Db(dbName, server);

db.open(function(err, db) {
	if(!err) {
		console.log('Connected to the database: ' + dbName);
		
		//Checking for all required collections.
		var arrSize = collections.length;
		console.log('size: ' + arrSize);
		for(var i = 0; i < arrSize; i++) {
			console.log('i: ' + i);
			db.collection(collections[i], {strict: true}, function(err, collection) {
				if(err) {
					console.log('A required collection was not found: ' + collection);
				}
			});
		}
	}
});

// Creating the web server.
var app = express();

app.configure(function() {
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(path.join(application_root, "public")));
	app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
});

app.get('/character', character.allCharacters(db));
app.get('/character/:id', character.getCharacterById(db));
app.post('/character', character.addCharacter(db));
app.put('/character/:id', character.updateCharacter(db));
app.delete('/character/:id', character.deleteCharacter(db));

app.listen(port);
console.log('Server started on port ' + port);




