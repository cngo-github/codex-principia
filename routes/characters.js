var mongo = require('mongodb');

var collectionName = 'characters';
var BSON = mongo.BSONPure;

// Get character by id.
exports.getCharacterById = function(db) {
	return function(req, res) {
		// Allow GET and POST requests across domains.
		res.header("Access-Control-Allow-Origin", "http://localhost");
		res.header("Access-Control-Allow-Methods", "GET, POST");
		
		var id = req.params.id;
		console.log('Retrieving character: ' + id);
		db.collection(collectionName, {strict: true}, function(err, collection) {
			collection.findOne({'_id': new BSON.ObjectID(id)}, function(err, item) {
				res.send(item);
			});
		});
	}
}

// Get all characters.
exports.allCharacters = function(db) {
	return function(req, res) {
		// Allow GET and POST requests across domains.
		res.header("Access-Control-Allow-Origin", "http://localhost");
		res.header("Access-Control-Allow-Methods", "GET, POST");
		
		db.collection(collectionName, function(err, collection) {
			collection.find().toArray(function(err, items) {
				res.send(items);
			});
		});
	}
}

// Add a new character.
exports.addCharacter = function(db) {
	return function(req, res) {
		// Allow GET and POST requests across domains.
		res.header("Access-Control-Allow-Origin", "http://localhost");
		res.header("Access-Control-Allow-Methods", "GET, POST");
		
		var character = req.body;
		console.log('Adding a new character: ' + JSON.stringify(character));
		db.collection(collectionName, function(err, collection) {
			collection.insert(character, {safe: true}, function(err, result) {
				if(err) {
					console.log('Failed to add a character: ' + err);
					res.send({'error': err});
				} else {
					console.log('Success: ' + JSON.stringify(result[0]));
					res.send(result[0]);
				}
			});
		});
	}
}

// Update an existing character.
exports.updateCharacter = function(db) {
	return function(req, res) {
		// Allow GET and POST requests across domains.
		res.header("Access-Control-Allow-Origin", "http://localhost");
		res.header("Access-Control-Allow-Methods", "GET, POST");
		
		var id = req.params.id;
		var character = req.body;
		
		console.log('Updating character: ' + id);
		console.log(JSON.stringify(character));
		
		db.collection(collectionName, function(err, collection) {
			collection.update({'_id': new BSON.ObjectID(id)}, character, {safe: true}, function(err, result) {
				if(err) {
					console.log('Failed to update a character: ' + err);
					res.send({'error': err});
				} else {
					console.log('' + result + ' document(s) updated.');
					res.send(character);
				}
			});
		});
	}
};

exports.deleteCharacter = function(db) {
	return function(req, res) {
		// Allow GET and POST requests across domains.
		res.header("Access-Control-Allow-Origin", "http://localhost");
		res.header("Access-Control-Allow-Methods", "GET, POST");
		
		var id = req.params.id;
		console.log('Deleting wine: ' + id);
		
		db.collection(collectionName, function(err, collection) {
			collection.remove({'_id': new BSON.ObjectID(id)}, {safe: true}, function(err, result) {
				if(err) {
					console.log('Failed to dalete a character: ' + err);
					res.send({'error': err});
				} else {
					console.log('' + result + ' document(s) deleted.');
					res.send(req.body);
				}
			});
		});
	}
}
