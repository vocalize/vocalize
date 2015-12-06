var audioParser = require('./lib/audio-parser');
var transcriptParser = require('./lib/transcript-parser');
var youtubeScraper = require('./lib/youtube-scraper');
var path = require('path');
var fs = require('fs');
var util = require('./lib/util');

// Initialize folders
if (!util.exists(path.join(__dirname, 'input'))) {
  fs.mkdirSync(path.join(__dirname, 'input'));
}
if (!util.exists(path.join(__dirname, 'output'))) {
  fs.mkdirSync(path.join(__dirname, 'output'));
}

// Transcript File
var transcriptFile = path.join(__dirname, 'input', 'transcript.json');

var scrapeTheTube = function() {
  // Download Youtube Audio with passed videoId
  youtubeScraper('IONyLZn0pLI')
    .then(function(audioPath) {
      // Check if there's a Watson transcript (Watson takes a while)
      if (!util.exists(transcriptFile)) {
        transcriptParser(audioPath)
          .then(function() {
            // Parse the audio file according to the transcript
            return audioParser(audioPath);
          })
          .then(function(outputDir) {
            console.log('Parsed files waiting in ' + outputDir);
          });
      } else {
        // Parse the audio file with existing transcript
        audioParser(audioPath)
          .then(function(outputDir) {
            console.log('Parsed files waiting in ' + outputDir);
          });
      }
    });
}

scrapeTheTube();