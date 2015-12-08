var spawn = require('child_process').spawn;
var fs = require('fs');
var ffmpeg = require('fluent-ffmpeg');
var path = require('path');
var promise = require('bluebird');


// Install youtube_dl locally: brew install youtube-dl
module.exports = function(videoId) {
  
  return new promise(function(resolve, reject) {
    var inputPath = path.join(__dirname, '..', 'input');
    youtube_dl = spawn('youtube-dl', ['--extract-audio', '--audio-format', 'mp3', '-o', inputPath + '/' + videoId + '.%(ext)s', "http://www.youtube.com/watch?v=" + videoId]);

    youtube_dl.stdout.on('data', function(data) {
      console.log(data.toString());
    });

    youtube_dl.stderr.on('data', function(data) {
      process.stderr.write(data);
    });

    youtube_dl.on('exit', function() {
      fs.readFile(inputPath + '/file.mp3', function(err, data) {
        ffmpeg(inputPath + '/file.mp3')
          .save(inputPath + '/file.flac')
          .on('progress', function(progress) {
            console.log('Processing: ' + progress.percent + '%');
          })
          .on('end', function() {
            resolve(inputPath + '/file.flac');
          });
      });
    });
  });
};
