'use strict';

var ffmpeg = require('fluent-ffmpeg');
var fs = require('fs');
var _ = require('underscore');
var path = require('path');
var promise = require('bluebird');
var readFile = promise.promisify(fs.readFile);
var config = require('./config/config');
var util = require('./util');

/**
 * Runs the passed callback function on each timestamp in the transcript
 * Transcript should be JSON
 */
var _forEachTimeStamp = function(transcript, func) {

  var transcript = JSON.parse(transcript).results;

  var ts = {};

  transcript.forEach(function(section) {

    section.alternatives[0].timestamps.forEach(function(timestamp) {

      ts = {
        word: timestamp[0],
        start: timestamp[1],
        end: timestamp[2],
        duration: timestamp[2] - timestamp[1]
      }

      func(ts);

    });
  });
};

/**
 * Creates a new directory for the parsed audio files
 */
var _createWordDir = function(outputDir, word) {
  return new promise(function(resolve, reject) {
    if (!util.exists(outputDir)) {
      fs.mkdirSync(outputDir);
      fs.writeFile(path.join(outputDir, 'word.txt'), word, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
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
 * @return {[promise]}              [resolves on successful split]
 */
var _splitAudioFileByTimeStamp = function(audioFilePath, ts, outputDir) {
  return new promise(function(resolve, reject) {
    ffmpeg(audioFilePath)
      .setStartTime(ts.start)
      // Add a buffer so audio file doesn't get cut off too early
      .setDuration(+ts.duration + 0.1)
      .audioChannels(1)
      .output(path.join(outputDir, ts.word + '.wav'))
      .on('end', function(err) {
        if (err) {
          reject(err);
        }
        console.log('Parsed ' + ts.word);
      })
      .on('error', function(err) {
        reject(err);
      }).run();
    resolve();
  });
};

/**
 * Splits the passed audio file into individual wav files
 * @param  {[string]} audioFilePath [audio file to parse]
 * @return {[promise]}              [resolves when parsing is complete]
 */
module.exports = function(audioFilePath) {

  var audioFilePath = path.join(__dirname, '..', audioFilePath);
  var transcriptFile = path.join(__dirname, '..', 'input', 'transcript.json');

  return new promise(function(resolve, reject) {
    readFile(transcriptFile)
      .then(function(transcript) {
        _forEachTimeStamp(transcript, function(ts) {
          var outputDir = path.join(__dirname, '..', 'output', ts.word)
            // Create a new directory for the current word if it doesn't exist
          _createWordDir(outputDir, ts.word)
            .then(_splitAudioFileByTimeStamp.bind(this, audioFilePath, ts, outputDir))
            .catch(reject);
        });
      })
      .catch(reject);
    resolve();
  });
};
