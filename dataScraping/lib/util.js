var fs = require('fs');
var BbPromise = require('bluebird');
var readdir = BbPromise.promisify(fs.readdir);
var pathParser = require('path');

/**
 * Checks if path is a valid file or directory
 * Returns boolean
 */

exports.exists = function(path) {
  try {
    return fs.statSync(path).isFile() || fs.statSync(path).isDirectory();
  } catch (err) {
    return false;
  }
};

exports.mkdir = function(path) {
  if (!exports.exists(path)) {
    fs.mkdirSync(path);
  }
  return path;
};

exports.readdir = function(path) {
  return readdir(path);
};

exports.getFilename = function(path) {
  var ext = pathParser.extname(path);
  var filename = pathParser.basename(path, ext);
  var file = filename + ext;
  return {
    ext: ext,
    filename: filename,
    file: file
  };
};

exports.handleError = function(err) {
  console.error('Blew it! ' + err);
};
