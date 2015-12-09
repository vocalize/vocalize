var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// TODO: figure out word schema
var wordSchema = new Schema({
  word: String
});

// compile schema into a Model
var Word = mongoose.model('Word', wordSchema);

/* 
TEST - insert a Word instance into the db then console.log the contents of the db

// create a word instance
var hello = new Word({word: 'hello'});

// save hello to the database
hello.save(function (err, hello) {
  if (err) {
  	return console.error(err);
  }
});

// display all of the word instances
Word.find(function (err, words) {
	if (err) {
		return console.error(err);
	}

	console.log(words);
});

*/

module.exports = Word;