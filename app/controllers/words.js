var Word = require('../models/word');
var util = require('../util');
var fs = require('fs');
var ds = require('descriptive-statistics');
var winston = require('winston');
var binaryServer = require('binaryjs').BinaryServer;
var wav = require('wav');
var stream = require('stream');
var child_process = require('child_process');
var currentWords = {};

exports.compareAudio = function(req, res) {

  var sound = req.body;
  var word = req.cookies.word;

  // Create a new stream
  var bufferStream = new stream.PassThrough();

  // Pass the buffer into the stream
  bufferStream.end(sound);

  console.log('comparing to:', word);

  Word.findOne({
      'word': word
    })
    .then(function(word) {
      // Create a new wav writer
      var wavWriter = new wav.FileWriter('processing/user.wav', {
        channels: 1
      });

      // Pipe the stream into wav writer
      bufferStream.pipe(wavWriter);

      word.downloadAudioFile('processing/control.wav').then(function() {
        child_process.exec('python process.py user.wav control.wav', {
          cwd: 'processing'
        }, function(error, stdout, stderr) {
          console.log('stdout: ' + stdout);
          if (error !== null) {
            winston.error('stderr: ', stderr);
          }
          winston.log('stdout: ', stdout);

          var score = parseFloat(stdout);
          var mean = word.scores.mean;
          var stdDeviation = word.scores.standard_deviation;
          var distance, stdDeviationCount;
          if (stdDeviation === 0) {
            distance = 0;
            stdDeviationCount = 0;
          } else {
            distance = score - mean;
            stdDeviationCount = distance / stdDeviation;
          }

          child_process.exec('python peaks.py user.wav control.wav', {
            cwd: 'processing'
          }, function(error, stdout, stderr) {
            console.log('stdout: ' + stdout);
            if (error !== null) {
              winston.error('stderr: ', stderr);
            }
            winston.log('stdout: ', stdout);

            var peaks = JSON.parse(stdout);
            var results = {
              score: score,
              mean: mean,
              stdDeviation: stdDeviation,
              distance: distance,
              stdDeviationCount: stdDeviationCount,
              peaks: peaks
            }

            console.log(results);
            res.status(200).send(results);
          });
          
        });
      });
    });
};

exports.setWord = function(req, res) {
  var ip = util.getIp(req);
  currentWords[ip] = req.body.word;
  res.json('ok');
};

/**
 * Gets one word based on the passed query string
 * @param  {[object]} req [includes query string]
 * @param  {[object]} res [response]
 * @return {[object]}     [word object from db]
 */
exports.getWord = function(req, res) {
  Word.findOne(req.query)
    .then(function(word) {
      if (!word) {
        res.status(404).send('Word not found');
      } else {
        res.status(200).send(word);
      }
    })
    .catch(function(err) {
      res.status(500).send('Error finding word');
    });
};

/**
 * Will get the next word in the list by word_index
 * Will restart at 0 after reaching last word index
 * Searches by all queries in the get query string
 * Set &previous=true to optionally get previous word
 * ie GET /api/words/index?language=english&gender=male
 * @param  {[object]} req [include query string to search by]
 * @param  {[object]} res [response]
 * @return {[object]}     [word object from db]
 */
exports.getWordByNextIndex = function(req, res) {

  var word_index = req.cookies.word_index;
  var previous = req.query.previous;
  var sort = 1;

  if (previous) delete req.query.previous;

  // Check if cookie is set
  if (word_index !== undefined) {

    // If previous is set get previous word
    if (previous) {
      sort = -1;
      req.query.word_index = {
        $lt: word_index
      };
    // Get next word
    } else {
      req.query.word_index = {
        $gt: word_index
      };
    }

    // Assign first word if cookie isn't set
  } else {
    req.query.word_index = {
      $gte: 0
    };
  }

  // Run query
  _getWordByIndexQuery(req.query, sort)
    .then(function(word) {
      // Set cookies on the response
      _setCookie(res, word);
      res.send(word);
    })
    .catch(function(err) {
      res.status(404).send('Error Finding Word');
    });

};

exports.getWordByPrevIndex = function(req, res) {
  
  var word_index = _decWordIndexCookie(res, req.cookies.word_index);

  if (word_index) {
    req.query.word_index = {
      $lt: word_index
    };
    Word.find(req.query).sort({
        word_index: -1
      })
      .limit(1)
      .then(function(word) {
        console.log(word);
        if (!word.length) {
          _findRootWord(req, res);
        } else {
          res.cookie("word" , word[0].word);
          res.status(200).send(word[0]);
        }
      })
      .catch(function(err) {
        res.status(500).send('Error finding word');
      });
  } else {
    res.status(400).send('Word Index Not Included');
  }
};
/**
 * Runs a query to find a word based on its word_index value
 * If no words are found, calls itself once to find word_index: 0 
 * @param  {[object]}  query  [mongodb query]
 * @param  {[number]}  sort   [1 sort word_index ascending, -1 sort descending]
 * @param  {[boolean]} _root  [gets set to true when function calls itself]
 * @return {[promise]}        [returns promise object that resolves with found word]
 */
var _getWordByIndexQuery = function(query, sort, _root) {

  return Word.find(query).sort({
      word_index: sort
    })
    .limit(1)
    .then(function(word) {
      // If no words are found with specified query
      // Usually if word_index is at the last word
      if (!word.length) {
        // Break out of infinite loop if no words are found
        // on second call
        if (_root) {
          reject('Error finding word');
        }

        // Reset word_index to 0 at the first word
        query.word_index = {
          $gte: 0
        }

        // Run function again to return first word
        return _getWordByIndexQuery(query, 1, true);
      } else {
        // Return found word
        return word[0];
      }
    })
    .catch(function(err) {
      return BbPromise.reject(err);
    });

};

var _getIndexFromCookie = function(req){
  if(!req.cookies || !req.cookies.word_index){
    return 0;
  } else {
    return parseInt(req.cookies.word_index);
  }
};

/**
 * Sets response cookie to include word and word index
 * @param {[object]} res  [response object]
 * @param {[object]} word [result document to set to the cookie]
 */
var _setCookie = function(res, word) {
  res.cookie('word_index', word.word_index);
  res.cookie('word', word.word);
};



var _incWordIndexCookie = function(res, cookie) {
  var word_index;

  if ( !cookie ) {
    word_index = 0;
    res.cookie("word_index" , word_index);
    return word_index.toString();
  } else {
    word_index = parseInt(cookie);
    res.cookie("word_index", word_index + 1);
    return word_index.toString();
  }
};

var _decWordIndexCookie = function(res, cookie) {
  var word_index;

  if ( !cookie ) {
    word_index = 0;
    res.cookie("word_index" , word_index);
    return word_index.toString();
  } else {
    word_index = parseInt(cookie);
    res.cookie("word_index", word_index - 1);
    return word_index.toString();
  }
};
