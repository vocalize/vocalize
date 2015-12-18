var spawn = require('child_process').spawn;
var fs = require('fs');
var ffmpeg = require('fluent-ffmpeg');
var path = require('path');
var BbPromise = require('bluebird');
var util = require('./util');
var config = require('./config/config');

var inputDir = config.inputDir;

// Install youtube_dl locally: brew install youtube-dl
exports.download = function(videoId) {

  util.mkdir(path.join(inputDir, videoId));
  util.mkdir(path.join(inputDir, videoId, 'transcripts'));

  return exports.youtube_dl(videoId, inputDir)
    .then(function() {
      return _sliceAudioByInterval(videoId, config.audioChunkLength);
    });
};

exports.youtube_dl = function(videoId, directory) {
  return new BbPromise(function(resolve, reject) {
    var inputPath = inputDir;
    var youtube_dl = spawn('youtube-dl', ['--extract-audio', '--audio-format', 'mp3', '-R', '100', '-o', directory + '/' + videoId + '.%(ext)s', "http://www.youtube.com/watch?v=" + videoId]);

    youtube_dl.stdout.on('data', function(data) {
      console.log(data.toString());
    });

    youtube_dl.stderr.on('data', function(data) {
      process.stderr.write(data);
    });

    youtube_dl.on('exit', function() {
      resolve();
    });
  });
};

// Get the length of the audio
var _getFileInfo = function(file) {

  var ext = path.extname(file);
  var filename = path.basename(file, ext);

  return new BbPromise(function(resolve, reject) {
    
    ffmpeg.ffprobe(file, function(err, metadata) {
      if (err) {
        reject(err);
      }
      resolve({
        file: file,
        filename: filename,
        ext: ext,
        metadata: metadata,
        duration: metadata.format.duration
      });
    });
  });
};

// Slice length up into ten minute pieces
var _sliceAudioByInterval = function(videoId, interval) {

  var file = path.join(inputDir, videoId + '.mp3');

  return _getFileInfo(file)
    .then(function(file) {

      var outputDir = path.join(inputDir, file.filename);

      file.outputDir = outputDir;

      var commands = [];

      for (var i = 0; i < file.duration; i += interval) {
        commands.push(_slice.bind(this, file, i, interval, i / interval));
      }
      return BbPromise.each(commands, function(command) {
        return command();
      });
    });
};

var _slice = function(file, start, interval, idx) {

  var newFile = path.join(file.outputDir, idx + '-' + file.filename + '.flac');

  return new BbPromise(function(resolve, reject) {

    ffmpeg(file.file)
      // Time to begin parsing
      .setStartTime(start)
      // Duration of snippet
      // Add a buffer so audio file doesn't get cut off too early
      .setDuration(interval)
      // set the number of channels
      .audioChannels(1)
      // Output file location
      .output(newFile)
      // Success
      .on('end', function(err) {
        if (err) {
          reject(err);
        }
        resolve();
      })
      //Failure
      .on('error', function(err) {
        util.handleError();
      })
      //Run ffmpeg command
      .run();
  });
};
