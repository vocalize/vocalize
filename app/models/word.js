var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Counter = require('./counter');

// TODO: figure out word schema
var wordSchema = new Schema({
  word_index: {type: Number, unique: true},
  word: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true
  },
  accent: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  level: String,
  s3: {
    Bucket: {
      type: String,
      required: true
    },
    Key: {
      type: String,
      required: true,
      unique: true
    }
  },
  created_at: {
    type: Date
  }
});

wordSchema.pre('save', function(next) {
  console.log('saving....');
  // Initializes the created_at date
  if (!this.created_at) {
    this.created_at = new Date();
  }

  this.s3.Key = this._id + '-' + this.s3.Key;

  Counter.findByIdAndUpdate('word_list', {$inc: {seq: 1}}, {upsert: true}, function(err, counter){

  	if(err){
  		return next(err);
  	}
  	if(!counter){
  		this.word_index = 0;
  	} else {
	  	this.word_index = counter.seq;
  	}
	  next();

  }.bind(this));
});

// Ensure that words are unique to language, gender, and accent.
wordSchema.index({word: 1, language: 1, gender: 1, accent: 1}, {unique: true});

// compile schema into a Model
module.exports = mongoose.model('Word', wordSchema);

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