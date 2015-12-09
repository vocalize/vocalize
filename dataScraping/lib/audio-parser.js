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
 * Splits all of the flac files in the directory by their transcript
 * @param  {[string]} audioFilePath [audio file to parse]
 * @return {[BbPromise]}            [resolves when parsing is complete]
 */
module.exports = function(videoId) {
  console.log('parsing audio into words...');
  // Get directory
  var audioDir = path.join(__dirname, '..', 'input', videoId);

  // Read all the files in the directory
  return util.readdir(audioDir)
    .then(function(files) {

      // Associated each audio file with its transcript file
      return _getTranscriptsForAudioDirectory(files, videoId);

    }).then(function(map) {
      return BbPromise.map(map, function(audio) {
        // Parse each audio file according to its transcript file
        return _doIt(audio.audioFile, audio.transcript);
      });
    });
};

/**
 * Driver Function.  Parses and individual audio file according to its transcript
 * @param  {[string]} audioFilePath  [audio file to parse]
 * @param  {[string]} transcriptFile [watson transcript with timestamps]
 * @return {[promise]}               [resolves when file is done parsing]
 */
var _doIt = function(audioFilePath, transcriptFile) {
  if(util.exists(transcriptFile)){
    return readFile(transcriptFile)
    .then(function(transcript) {

      var timestamps = _parseTimeStamps(transcript);

      // Create an ffmpeg command for each timestamp and push them into the ffmpegCommand array
      // Each command is bound with the correct arguments
      // Each command will be saved as a promise so that they can be executed serially
      // If they are done all at once, too many child processes are spawned and ffmpeg explodes

      var ffmpegCommands = timestamps.map(function(ts, idx) {
        return _splitAudioFileByTimeStamp.bind(this, audioFilePath, ts, idx);
      });

      // Run Bluebird each function on ffmpegCommands
      // Each element is a promise wrapped around an ffmpeg command
      // each will run every command after the previous one resolved

      return BbPromise.each(ffmpegCommands, function(command) {
        return command();
      });

    })
    .then(function() {
      console.log('Done parsing ' + path.parse(audioFilePath).base);
    })
    .catch(function(err) {
      util.handleError(err);
    });
  } else {
    console.log('Could not find transcript: ' + transcriptFile);
    return false;
  }
};

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

  return new BbPromise(function(resolve, reject) {

    // Check if directory already exists
    if (!util.exists(outputDir)) {

      // Create new directory
      util.mkdir(outputDir);
      util.mkdir(path.join(outputDir, 'standard'));

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
  console.log('Splitting ' + path.basename(audioFilePath));
  var outputDir = path.join(__dirname, '..', 'output', ts.word);

  return new BbPromise(function(resolve, reject) {

    _createWordDir(outputDir, ts.word)
      .then(function() {

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
          .on('progress', function(progress){
            console.log('Splitting: ' + progress.percent.toFixed(2));
          })
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
 * Associates audio files with their transcript files
 * @param  {[array]} files    [list of files in a directory]
 * @param  {[string]} videoId [videoId used to find the right directory]
 * @return {[object]}         [{audioFile:<path to audiofile>, transcript:<path to transcript>}]
 */
var _getTranscriptsForAudioDirectory = function(files, videoId) {

  var audioDir = path.join(__dirname, '..', 'input', videoId);
  var transcriptDir = path.join(audioDir, 'transcripts');

  return files.filter(function(file) {
      return path.parse(file).ext === '.flac';
    })
    .map(function(file) {

      return {
        audioFile: path.join(audioDir, file),
        transcript: path.join(transcriptDir, path.parse(file).name + '-transcript.json')
      };
    });
};
