var Word = require('../models/word');
var util = require('../util');
var fs = require('fs');
var winston = require('winston');
var binaryServer = require('binaryjs').BinaryServer;
var wav = require('wav');
var stream = require('stream');
var child_process = require('child_process');
var currentWords = {};

exports.compareAudio = function(req, res) {
  
  var sound = req.body;
  var word = req.cookies.word

  // Create a new stream
  var bufferStream = new stream.PassThrough();

  // Pass the buffer into the stream
  bufferStream.end(sound);

  console.log('comparing to:', word);
  
  Word.findOne({'word': word})
    .then(function(word) {
      // Create a new wav writer
      var wavWriter = new wav.FileWriter('processing/user.wav', {channels: 1});

      // Pipe the stream into wav writer
      bufferStream.pipe(wavWriter);

      word.downloadAudioFile('processing/control.wav').then(function() {
        child_process.exec('bash compareuser.sh user.wav control.wav', {
          cwd: 'processing'
        }, function (error, stdout, stderr) {
          console.log('stdout: ' + stdout);
          if (error !== null) {
            console.log('stderr: ' + stderr);
            console.log('exec error: ' + error);

          }
          winston.log('stdout: ', stdout);
          winston.error('stderr: ', stderr);
          res.status(200).send(stdout);
        });
      });
    });
}

exports.setWord = function(req, res) {
  var ip = util.getIp(req);
  currentWords[ip] = req.body.word;
  res.json('ok');
}

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
 * If no words are found, will run _findRootWord 
 * to restart the word list at the lowest index
 * Searches by all queries in the get query string
 * ie GET /api/words/index/?language=english&gender=male
 * @param  {[object]} req [include query string to search by]
 * @param  {[object]} res [response]
 * @return {[object]}     [word object from db]
 */
exports.getWordByNextIndex = function(req, res) {
  
  var word_index = _setWordIndexCookie(res, req.cookies.word_index);

  if (word_index) {
    req.query.word_index = {
      $gt: word_index
    };

    Word.find(req.query).sort({
        word_index: 1
      })
      .limit(1)
      .then(function(word) {
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
 * Returns the word with the lowest word_index
 * matching all other parameters.
 * @param  {[object]} req [include query string to search by]
 * @param  {[object]} res [response]
 * @return {[object]}     [word object from db]
 */
var _findRootWord = function(req, res) {

  req.query.word_index = {
    $gte: 0
  };

  Word.find(req.query).sort({
      word_index: 1
    })
    .limit(1)
    .then(function(word) {
      if (!word.length) {
        res.status(404).send('No Words Found');
      } else {
        res.cookie("word_index", 0);
        res.cookie("word" , word[0].word);
        res.status(200).send(word[0]);
      }
    }).catch(function(err) {
      res.status(500).send('Error finding word');
    });
};

/**
 * Increment the word_index cookie
 * If word_index cookie does not exists, create it and set it to 0
 * @param  {[object]} res    [response]
 * @param  {[string]} cookie [current value of word_index]
 * @return {[string]}        [new value of word_index]
 */

var _setWordIndexCookie = function(res, cookie) {
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