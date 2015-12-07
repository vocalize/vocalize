'use strict';

var ffmpeg = require('fluent-ffmpeg');
var fs = require('fs');
var _ = require('underscore');
var path = require('path');
var promise = require('bluebird');
var config = require('./config/config');
var util = require('./util');

/**
 * Helper function to get a timestamp array from a Watson transcript json file
 * Must have a transcript file present
 * @return {[Promise]}               [Resolves with formated timestamp file]
 */
var getTimestamps = function() {

  var transcriptFile = path.join(__dirname, '..', 'input', 'transcript.json');

  return new promise(function(resolve, reject) {
    fs.readFile(transcriptFile, function(err, data) {
      if (err) {
        reject(err);
      }
      var content = data;
      var timestamps = JSON.parse(data).results[0].alternatives[0].timestamps;

      resolve(timestamps.map(function(timestamp) {
        return {
          raw: timestamp,
          word: timestamp[0],
          start: timestamp[1],
          end: timestamp[2],
          duration: timestamp[2] - timestamp[1]
        }
      }));
    });
  });
};

/**
 * Parses an audio file into separate files for each word.
 * Places each word audio file along with word.txt file into
 * individual directories.
 * @param  {[string]} audioFilePath  [audio file to parse]
 * @return {[Promise]}               [Resolves with output directory]
 */
module.exports = function(audioFilePath) {

  return new promise(function(resolve, reject) {
    // Get formatted timestamp array
    getTimestamps(__dirname, '..', 'input', 'transcript.json')
      .then(function(timestamps) {
        // Loop through each timestamp object
        timestamps.forEach(function(ts, idx) {

          var outputPath = path.join(__dirname, '..', 'output', ts.word)

          // Create a new directory for the current word if it doesn't exist
          console.log(util.exists(outputPath), outputPath);
          if (!util.exists(outputPath)) {
            fs.mkdirSync(outputPath);
            fs.writeFile(path.join(outputPath, 'word.txt'), ts.word, function(err) {
              if (err) console.log(err);
              else console.log('Created directory for ' + ts.word);
            });
          }

          // Parse the audio file by the timestamp's start and duration properties
          ffmpeg(audioFilePath)
            .setStartTime(ts.start)
            // Add a buffer so audio file doesn't get cut off too early
            .setDuration(+ts.duration + 0.2)
            .output(path.join(outputPath, ts.word + '.wav'))

          .on('end', function(err) {
              if (err) return console.log(err);
              console.log('Parsed ' + ts.word);
            })
            .on('error', function(err) {
              console.log('Error ' + err);
            }).run();
        });
        resolve(config.outputDir);
      });
  });
};
