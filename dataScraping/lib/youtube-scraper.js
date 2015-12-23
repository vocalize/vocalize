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

    var youtube_dl = spawn('youtube-dl', ['--extract-audio', '--audio-format', 'mp3', '-o', directory + '/' + videoId + '.%(ext)s', "http://www.youtube.com/watch?v=" + videoId]);

    youtube_dl.stdout.on('data', function(data) {
      console.log(data.toString());
    });

    youtube_dl.stderr.on('data', function(data) {
      process.stderr.write(data.toString());
    });

    youtube_dl.on('exit', function() {
      console.log('Finished Downloading ' + videoId);
      resolve();
    });
  });
};

// Get the length of the audio
var _getFileInfo = function(file) {

  var ext = path.extname(file);
  var filename = path.basename(file, ext);

  return new BbPromise(function(resolve, reject) {
    var content;
    var ffmpeg_probe = spawn('node', ['./dataScraping/lib/spawn/probeAudio.js', file]);

    ffmpeg_probe.stderr.on('data', function(err){
      reject(err.toString());
    });

    ffmpeg_probe.stdout.on('data', function(data){
      content = JSON.parse(data.toString());
    });

    ffmpeg_probe.on('exit', function(){

      resolve({
        file: file,
        filename: filename,
        ext: ext,
        metadata: content,
        duration: content.format.duration
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
      return BbPromise.map(commands, function(command) {
        return command();
      }, {concurrency: config.concurrencyLimit});
    });
};

var _slice = function(file, start, interval, idx) {

  var newFile = path.join(file.outputDir, idx + '-' + file.filename + '.flac');

  return new BbPromise(function(resolve, reject) {
    
    var ffmpeg_split = spawn('node', ['./dataScraping/lib/spawn/split.js', file.file, newFile, ''+start, ''+interval]);

    ffmpeg_split.stdout.on('data', function(data){
      console.log(data.toString());
    });

    ffmpeg_split.stderr.on('data', function(err){
      reject(err.toString());
    });

    ffmpeg_split.on('exit', function(){
      resolve();
    });
  });
};
