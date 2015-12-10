var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// TODO: figure out word schema
var wordSchema = new Schema({
  id: Number,
  word: String
});

// compile schema into a Model
var Word = mongoose.model('Word', wordSchema);

/*
// insert fake data into the database - this only needs to be run once

// create word instances
var word1 = new Word({
	id: 1,
	word: 'umbrella'
});

var word2 = new Word({
	id: 2,
	word: 'turtle'
});

var word3 = new Word({
	id: 3,
	word: 'waffle'
});

var word4 = new Word({
	id: 4,
	word: 'peanut'
});

var words = [word1, word2, word3, word4];

// save the word instances
words.forEach(function(word) {
	word.save(function(err, saved) {
		if (err) {
			return console.error(err);
		}

		console.log(saved);
	});
});

*/

module.exports = Word;