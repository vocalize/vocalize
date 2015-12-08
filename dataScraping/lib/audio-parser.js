'use strict';

var ffmpeg = require('fluent-ffmpeg');
var fs = require('fs');
var _ = require('underscore');
var path = require('path');
var BbPromise = require('bluebird');
var readFile = BbPromise.promisify(fs.readFile);
var wordList = require('./wordlist-parser').getWordList('eng-1000mostcommon');
var config = require('./config/config');
var util = require('./util');

// Set to false if all words should be considered
// Otherwise filters by words that exist in wordList
var _filterByWordList = true;

/**
 * Returns an array of timestamp objects denoting each word and its beginning, end, and duration
 * Filters out words not present in word list by default
 * @param  {[buffer]} buffer [buffer of the watson transcript object to parse timestamps from]
 * @return {[array]}         [array of timestamp objects]
 */
var _parseTimeStamps = function(buffer) {

    var transcript = JSON.parse(buffer.toString());

    var ts = {};
    var timestamps = [];

    transcript.forEach(function(section) {
      var tsList = section.results[0].alternatives[0].timestamps;

      tsList.forEach(function(timestamp) {
        ts = {
          word: timestamp[0],
          start: timestamp[1],
          end: timestamp[2],
          duration: timestamp[2] - timestamp[1]
        }

        // Check if filtering by wordlist and a wordList is present
        // Discard all words that aren't on the list 
        if (_filterByWordList && wordList && wordList[ts.word]) {
          timestamps.push(ts);
        }
      });
    });

    return timestamps;
};

/**
 * If directory for a given word doesn't exists, creates it and a text file containing that word
 * @param  {[string]} outputDir [parent directory for create directories]
 * @param  {[string]} word      [current word, will be the name of new directory]
 * @return {[promise]}          [resolves on completion]
 */
var _createWordDir = function(outputDir, word) {
  console.log(outputDir);
  return new BbPromise(function(resolve, reject) {
    
    // Check if directory already exists
    if (!util.exists(outputDir)) {
      
      // Create new directory
      fs.mkdirSync(outputDir);
      fs.mkdirSync(path.join(outputDir, 'standard'));
      
      //Create a text file containing the word stored in that directory
      fs.writeFile(path.join(outputDir, 'word.txt'), word, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    // Directory already exists
    } else {
      resolve();
    }
  });
};

/**
 * Splices out a new audio file between given timestamp objects
 * start and duration properties
 * @param  {[string]} audioFilePath [audio file to split]
 * @param  {[object]} ts            [time stamp object with word, start, and duration props]
 * @param  {[string]} outputDir     [directory to write parsed audio file to]
 * @return {[BbPromise]}              [resolves on successful split]
 */
var _splitAudioFileByTimeStamp = function(audioFilePath, ts, idx) {

  var outputDir = path.join(__dirname, '..', 'output', ts.word);

  return new BbPromise(function(resolve, reject) {
    
    console.log('Parsing: ' + ts.word);

    _createWordDir(outputDir, ts.word)
    .then(function(){

      ffmpeg(audioFilePath)
      .audioCodec('pcm_f32le')
      // Time to begin parsing
      .setStartTime(ts.start)
      // Duration of snippet
      // Add a buffer so audio file doesn't get cut off too early
      .setDuration(+ts.duration)
      // set the number of channels
      .audioChannels(1)
      // Output file location
      .output(path.join(outputDir, idx + ts.word + '.wav'))
      // Success
      .on('end', function(err) {
        if (err) {
          reject(err);
        }
        resolve();
      })
      //Failure
      .on('error', function(err) {
        reject(err);
      })
      //Run ffmpeg command
      .run();

    });

  });
};

/**
 * Splits the passed audio file into individual wav files
 * @param  {[string]} audioFilePath [audio file to parse]
 * @return {[BbPromise]}            [resolves when parsing is complete]
 */
module.exports = function(audioFilePath) {

  var audioFilePath = path.join(__dirname, '..', 'input', audioFilePath);
  var filename = path.basename(audioFilePath, '.flac');
  var transcriptFile = path.join(__dirname, '..', 'input', 'transcripts',  filename + 'transcript.json');

  // Get buffer fron transcript file
  return readFile(transcriptFile)
    .then(function(transcript){
      // Parse out time stamp information from the transcript file
      return new BbPromise(function(resolve, reject){
        resolve(_parseTimeStamps(transcript));
      });

    })
    .then(function(timestamps){

      // Initialize array of ffmpeg commands
      var ffmpegCommands = [];

      return new BbPromise(function(resolve, reject){
        
        // Create an ffmpeg command for each timestamp and push them into the ffmpegCommand array
        // Each command is bound with the correct arguments
        // Each command will be saved as a promise so that they can be executed serially
        // If they are done all at once, too many child processes are spawned and ffmpeg explodes
        
        timestamps.forEach(function(ts, idx){
          ffmpegCommands.push(_splitAudioFileByTimeStamp.bind(this, audioFilePath, ts, idx));
        });
        resolve(ffmpegCommands);
      });

    })
    .then(function(ffmpegCommands){

      // Run Bluebird each function on ffmpegCommands
      // Each element is a promise wrapped around an ffmpeg command
      // each will run every command after the previous one resolved
      
      BbPromise.each(ffmpegCommands, function(command){
        return command();
      });

    })
    .then(function(){
      console.log('Done parsing ' + audioFilePath);
    })
    .catch(function(err){
      util.handleError(err);
    });
};

