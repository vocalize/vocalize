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

  return new promise(function(resolve, reject) {

    var params = {
      audio: fs.createReadStream(audioFilename),
      content_type: 'audio/flac',
      timestamps: true
    };

    speech_to_text.recognize(params, function(err, transcript) {
      if (err) {
        reject(err);
      } else
        fs.writeFile(path.join(__dirname, '..', 'input', 'transcript.json'), JSON.stringify(transcript, null, 2), function(err) {
          if (err) {
            reject(err);
          } else {
            resolve(path.join(__dirname, '..', 'input', 'transcript.json'));
          }
        });
    });
  })
};
