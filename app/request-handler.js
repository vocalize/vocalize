var mongoose = require('mongoose');
var Word = require('./models/word');

/*
schema required by the frontend:
  data = {
	  targetWord: String,
	  targetWordAudio: String,
	  percentComplete: Number
  }
*/

var wordId;

var parseDatabaseResponse = function(resp) {
  var data = {};
  data.targetWord = resp[0].word;
  data.targetWordAudio = null;
  data.percentComplete = null;

  return data;
};

module.exports.retrieveNextWord = function(req, res, next) {
  wordId = wordId || 1;

  // if there are no more entries left in the db, start from the begining
  Word.count({})
  .then(function(count) {
  	if ( wordId > count ) {
  		wordId = 1;
  	}

    // query the db for the next word
    var query = {
    	id: wordId
    };

  	return Word.find(query);
  })
  .then(function(word) {
    wordId++;
    var data = parseDatabaseResponse(word);
  	res.status(200).send(data);
  });
};