'use strict';

var audioParser = require('./lib/audio-parser');
var transcriptParser = require('./lib/transcript-parser');
var youtubeScraper = require('./lib/youtube-scraper');
var wordlistParser = require('./lib/wordlist-parser');
var standardiseWordLength = require('./lib/standardise-word-length');
var path = require('path');
var fs = require('fs');
var util = require('./lib/util');

// Initialize folders
util.mkdir(path.join(__dirname, 'input'));
util.mkdir(path.join(__dirname, 'output'));

var scrape = function(videoId, language){
  youtubeScraper.download(videoId)
    .then(transcriptParser.getTranscript.bind(this, videoId, language))
    .then(audioParser.bind(this, videoId, language))
    .then(standardiseWordLength.bind(this))
    .catch(util.handleError);
};

var flags = process.argv.slice(2);

switch(flags[0]){
  // Driver Function
  // Takes <video id> and <language> as params
  // Languages must be supported by Watson - check transcript-parser.js for details
  // Downloads video from youtube and breaks into 10 minute chunks
  // Gets transcript from watson
  // Splits video by transcript
  // Standardizes all audio file lengths
  case 'scrape':
    scrape(flags[1], flags[2]);
    break;
  // pass in youtube video id as argument
  // Downloads to input subdirectory named for videoId
  // ie. node index.js youtube VKUyezKHNXk
  case 'youtube':
    youtubeScraper.download(flags[1]);
    break;
  // Gets an audiotranscript from watson for an audio file
  // Pass in a videoId
  // Looks for all audio files in input directory for a subdirectory named for videoId
  // ie. node index.js watson VKUyezKHNXk
  case 'watson':
    transcriptParser(flags[1]);
    break;
  // Pass a videoId
  // Looks for transcript.json file prefixed with same name as audiofile
  // ie. node index.js parse VKUyezKHNXk
  case 'parse':
    audioParser(flags[1], flags[2]);
    break;
  // Will create a json object from a \n delimited
  // text list of words
  case 'wordlist':
    wordlistParser.textToJson(flags[1]);
    break;
  // Will standardize the time length of all sub directories in the output directory
  // ie. node index.js standardize
  case 'standardize':
    standardiseWordLength();
    break;
}