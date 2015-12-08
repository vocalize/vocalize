'use strict';

var watson = require('watson-developer-cloud');
var fs = require('fs');
var path = require('path');
var promise = require('bluebird');
var config = require('./config/config');

var speech_to_text = watson.speech_to_text({
  username: config.username,
  password: config.password,
  version: 'v1',
  url: 'https://stream.watsonplatform.net/speech-to-text/api',
});

/**
 * Queries Watson to get the transcript of an audio file with timestamps
 * @param  {[string]} audioFilename [filename of the audio file]
 * @param  {[string]} audioFilepath [(optional) filepath - defaults to config.inputDir]
 * @return {[Promise]}              [Resolves with transcript file path]
 */

module.exports = function(audioFilename) {

  var filename = path.basename(audioFilename, '.flac');

  return new promise(function(resolve, reject) {

    var params = {
      content_type: 'audio/flac',
      timestamps: true,
      continuous: true
    };

    var results = [];

    // create the stream
    var recognizeStream = speech_to_text.createRecognizeStream(params);

    // pipe in some audio
    fs.createReadStream(path.join(__dirname, '..', 'input', audioFilename)).pipe(recognizeStream);

    // listen for 'data' events for just the final text
    // listen for 'results' events to get the raw JSON with interim results, timings, etc.

    recognizeStream.setEncoding('utf8'); // to get strings instead of Buffers from `data` events

    recognizeStream.on('results', function(e){
      //console.log('Results: ' + e.results[0].alternatives[0].transcript);
      if(e.results[0].final){
        results.push(e);
      }
    });

    ['data', 'results', 'error', 'connection-close'].forEach(function(eventName) {
      recognizeStream.on(eventName, console.log.bind(console, eventName + ' event: '));
    });
  
    recognizeStream.on('error', function(err){
      util.handleError('Error writing to transcript.json: ' + err);
    });

    recognizeStream.on('connection-close', function() {
      fs.writeFile('./input/transcripts/' + filename + 'transcript.json', JSON.stringify(results), function(err){
        if(err){
          util.handleError(err);
        }
        console.log('Transcript Sucessfully Written to ' + '/input/transcript.json');
      });
    });
  });
};





