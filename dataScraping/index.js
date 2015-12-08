var audioParser = require('./lib/audio-parser');
var transcriptParser = require('./lib/transcript-parser');
var youtubeScraper = require('./lib/youtube-scraper');
var wordlistParser = require('./lib/wordlist-parser');
var standardiseWordLength = require('./lib/standardise-word-length');
var path = require('path');
var fs = require('fs');
var util = require('./lib/util');

// Initialize folders
if (!util.exists(path.join(__dirname, 'input'))) {
  fs.mkdirSync(path.join(__dirname, 'input'));
  fs.mkdirSync(path.join(__dirname, 'input', 'transcripts'));
}
if (!util.exists(path.join(__dirname, 'output'))) {
  fs.mkdirSync(path.join(__dirname, 'output'));
}

var flags = process.argv.slice(2);
  
switch(flags[0]){
  // pass in youtube video id as argument
  // downloads to input folder <video-id>.flac
  // ie. node index.js youtube VKUyezKHNXk
  case 'youtube':
    youtubeScraper(flags[1]);
    break;
  // Pass in flac file path to get the timestamped transcript from watson
  // ie. node index.js watson VKUyezKHNXk.flac
  case 'watson':
    transcriptParser(flags[1]);
    break;
  // Pass in audio file path
  // Looks for transcript.json file prefixed with same name as audiofile
  // ie. node index.js parse VKUyezKHNXk.flac
  case 'parse':
    audioParser(flags[1]);
    break;
  // Will create a json object from a \n delimited
  // text list of words
  case 'wordlist':
    wordlistParser.textToJson(flags[1]);
    break;
  // Will standardize the time length of all audio files in an output subdirectory
  // Pass a directory in the output folder
  // ie. node index.js tempo but
  case 'standardize':
    standardiseWordLength(flags[1]);
    break;
}