var fs = require('fs');
var path = require('path');
var config = require('../config/config');
var watson = require('watson-developer-cloud');

var speech_to_text = watson.speech_to_text({
  username: config.username,
  password: config.password,
  version: 'v1',
  url: 'https://stream.watsonplatform.net/speech-to-text/api',
});

var audioFile = process.argv[2];
var transcriptDir = process.argv[3];

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
  	process.stdout.write(e.results[0].alternatives[0].transcript);
    results.push(e);
  }
});

recognizeStream.on('error', function(err) {
  process.stderr.write('Error writing to transcript.json: ' + err);
});

recognizeStream.on('connection-close', function() {
  var trancriptFile = path.join(transcriptDir, filename + '-transcript.json');
  fs.writeFile(trancriptFile, JSON.stringify(results), function(err) {
    if(err){
    	process.stderr.write(err);
    }
  });
});
