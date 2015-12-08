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

var flags = process.argv.slice(2);

switch(flags[0]){
  // pass in youtube video id
  case 'youtube':
    youtubeScraper(flags[1]);
    break;
  // Pass in audio file path
  case 'watson':
    transcriptParser(flags[1]);
    break;
  // Pass in audio file path
  // Requires a transcript file
  case 'parse':
    audioParser(flags[1]);
    break;
}