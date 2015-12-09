'use strict';

var watson = require('watson-developer-cloud');
var fs = require('fs');
var path = require('path');
var BbPromise = require('bluebird');
var readdir = BbPromise.promisify(fs.readdir);
var config = require('./config/config');
var util = require('./util');

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
 * @return {[BbPromise]}            [Resolves with transcript file path]
 */
module.exports = function(videoId) {
  console.log('getting transcript from watson...');
  var audioFileDirectory = path.join(__dirname, '..', 'input', videoId);
  var transcriptDir = path.join(__dirname, '..', 'input', videoId, 'transcripts');

  return readdir(audioFileDirectory)
    .then(function(files) {

      var transcriptProcesses = files.filter(function(file){
        return path.extname(file) === '.flac';
      })
      .map(function(file, idx) {
          var filePath = path.join(audioFileDirectory, file);
          return _watsonStream.bind(this, filePath, transcriptDir);
      });

      return BbPromise.each(transcriptProcesses, function(process) {
        return process();
      });
    });
};

var _watsonStream = function(audioFile, transcriptDir) {

  return new BbPromise(function(resolve, reject) {

    var ext = path.extname(audioFile);
    var filename = path.basename(audioFile, ext);

    var params = {
      content_type: 'audio/flac',
      timestamps: true,
      continuous: true
    };

    var results = [];

    // create the stream
    var recognizeStream = speech_to_text.createRecognizeStream(params);

    // pipe in some audio
    fs.createReadStream(audioFile).pipe(recognizeStream);

    // listen for 'data' events for just the final text
    // listen for 'results' events to get the raw JSON with interim results, timings, etc.

    recognizeStream.setEncoding('utf8'); // to get strings instead of Buffers from `data` events

    recognizeStream.on('results', function(e) {
      if (e.results[0].final) {
        results.push(e);
      }
    });

    ['data', 'results', 'error', 'connection-close'].forEach(function(eventName) {
      recognizeStream.on(eventName, console.log.bind(console, eventName + ' event: '));
    });

    recognizeStream.on('error', function(err) {
      util.handleError('Error writing to transcript.json: ' + err);
    });

    recognizeStream.on('connection-close', function() {
      var trancriptFile = path.join(transcriptDir, filename + '-transcript.json');
      fs.writeFile(trancriptFile, JSON.stringify(results), function(err) {
        if (err) {
          util.handleError(err);
        }
        resolve();
      });
    });
  });
};
