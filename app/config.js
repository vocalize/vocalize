var mongoose = require('mongoose');

// Set Bluebird as Mongoose Promise provider
mongoose.Promise = require('bluebird');

var mongoURI;

if (process.env.MONGOLAB_URI) {
  mongoURI = process.env.MONGOLAB_URI;
} else if (process.env.NODE_ENV === 'test') {
  mongoURI = 'mongodb://localhost/vocalizetest';
} else {
  mongoURI = 'mongodb://localhost/vocalize';
}

mongoose.connect(mongoURI);

// we have pending connection to the db
// this code will nofity us once we connect successfully or if an error occurs
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
 console.log('Mongodb connection open');
});

module.exports = db;

