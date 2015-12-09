var fs = require('fs');
var ffmpeg = require('fluent-ffmpeg');
var path = require('path');
var BbPromise = require('bluebird');
var readdir = BbPromise.promisify(fs.readdir);
var stat = BbPromise.promisify(fs.stat)

module.exports = function() {
  console.log('standardizing...');
  var outputDir = path.join(__dirname, '..', 'output');

  return readdir(outputDir)
    .then(function(dirs) {
      // Add full directory paths
      dirs = dirs.map(function(dir){
        return path.join(outputDir, dir);
      });
      // Filter out any non-directories
      return BbPromise.filter(dirs, function(dir) {
        return stat(dir)
          .then(function(stats) {
            return stats.isDirectory();
          });
      });
    })
    .then(function(directories) {
      BbPromise.each(directories, function(dir){
        return _standardiseWordDirectory(dir);
      });
    });
};

var _standardiseWordDirectory = function(dir) {
  console.log(dir);
  var audioFileMetaData = [];

  // Get each audio file
  return _getAudioFiles(dir)
    .then(function(files) {

      // Get an array of promises containing ffprobe commands
      // Each command will find the metadata for each bound file
      var ffprobeCommands = files.map(function(file) {
        return _getFileInfo.bind(this, file);
      });

      // Execute ffprobe commands to get metadata
      return BbPromise.map(ffprobeCommands, function(command) {
        return command();
      });

    })
    .then(function(fileData) {

      // Find average duration for all the files
      var avg = fileData.reduce(function(total, file) {
        return total + file.duration;
      }, 0) / fileData.length;

      // Get an array of promises containing ffmpeg commands
      // Each will modify the tempo of the file to make them standard lengths
      var commands = fileData.map(function(file) {
        return _modifyTempo.bind(this, file, avg);
      });

      return BbPromise.each(commands, function(command) {
          command();
        })
        .then(function() {
          console.log('Standardized Times for: ' + path.basename(dir));
        });
    });
};

var _getAudioFiles = function(directory) {
  return new BbPromise(function(resolve, reject) {
    fs.readdir(directory, function(err, metadata) {
      if (err) {
        reject(err);
      }

      var audioFiles = metadata.filter(function(file) {

        return path.extname(file) === '.wav';

      }).map(function(file) {
        return path.join(directory, file);
      })

      resolve(audioFiles);
    });
  });
};

var _getFileInfo = function(file) {
  return new BbPromise(function(resolve, reject) {
    ffmpeg.ffprobe(file, function(err, metadata) {
      if (err) {
        reject(err);
      }
      resolve({
        file: file,
        metadata: metadata,
        duration: metadata.format.duration
      });
    });
  });
};

var _modifyTempo = function(file, avg) {

  var tempo = file.duration / avg;
  var filename = path.basename(file.file, '.wav');
  var dirname = path.dirname(file.file);
  var newFile = path.join(dirname, 'standard', filename + '.wav');

  return new BbPromise(function(resolve, reject) {

    ffmpeg(file.file)
      .audioCodec('pcm_f32le')
      .audioFilters('atempo=' + tempo)
      .output(newFile)
      .on('end', function(err) {
        if (err) {
          reject(err);
        }
        resolve();
      })
      .on('error', function(err) {
        reject(err);
      })
      .run();
  });
};
