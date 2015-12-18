var s3 = require('s3');
var BbPromise = require('bluebird');
var path = require('path');
var fs = require('fs');
var mongoose = require('mongoose');
var config = require('./config');
var util = require('../util');

// Set Mongoose Promise Library
mongoose.Promise = BbPromise;

// Promisify fs functions
var readFile = BbPromise.promisify(fs.readFile);
var readdir = BbPromise.promisify(fs.readdir);

var Word = require('../models/word');

// Set up s3 credentials
var client = s3.createClient({
  s3Options: {
    accessKeyId: config.key,
    secretAccessKey: config.secret
  }
});

/**
 * Uploads all wav files in a directory to s3
 * Saves corresponding entries to DB
 * Requires params.json file to populate DB fields
 * @param {[string]} directory [path to directory to upload]
 */
exports.addWordsByDir = function(directory) {

  var params,
    metadataFile = path.join(directory, 'params.json');

  if (!util.exists(directory)) {
    return BbPromise.reject('Directory does not exist');
  }

  // Connect to MongoDB
  return exports.openDbConnection()
    // Read data file to get params
    .then(function() {
      return readFile(metadataFile);
    })
    .then(function(data) {

      params = JSON.parse(data);
      // Read files in Directory
      return readdir(directory);
    })
    .then(function(files) {

      // Filter for wav files
      files = files.filter(function(file) {
        return path.parse(file).ext === '.wav';
        // Bind upload/save commands for each file
      }).map(function(file) {
        return exports.uploadWordAndSave.bind(this, path.join(directory, file), params);
      });

      // Run each upload/save command
      return BbPromise.each(files, function(command) {
        return command();
      });
    })
    .then(function() {
      // console.log('done!');
    })
    .catch(function(err) {
      return BbPromise.reject(err);
    })
    .finally(function() {
      exports.closeDbConnection();
    });
};

/**
 * Upload and Save a single word
 * @param {[string]} file   [audio file to upload]
 * @param {[object]} params [params to save on db]
 */
exports.addWord = function(file, params) {
  if (!util.exists(file)) {
    return BbPromise.reject('Can not find ' + file);
  }
  return exports.openDbConnection()
    .then(function() {
      return exports.uploadWordAndSave(file, params);
    })
    .catch(function(err) {
      console.log(err);
    })
    .finally(function() {
      exports.closeDbConnection();
    });
};

/**
 * Upload a file to Amazon S3
 * File assumed to be in the same directory
 * @param  {[string]} filename [file to be upload]
 * @return {[promise]}         [resolves on successful upload]
 */
exports.uploadFile = function(filepath, word) {
  return new BbPromise(function(resolve, reject) {

    var params = {
      localFile: filepath,

      s3Params: {
        Bucket: config.bucket,
        Key: word.s3.Key
      }
    };

    var uploader = client.uploadFile(params);
    uploader.on('error', function(err) {
      console.error("unable to upload:", err.stack);
      reject(err);
    });
    uploader.on('progress', function() {
      console.log("progress", uploader.progressMd5Amount,
        uploader.progressAmount, uploader.progressTotal);
    });
    uploader.on('end', function() {
      resolve();
    });
  });
};

/**
 * Downloads a file from S3 to server FileSystem
 * @param  {[string]} filepath [path to save file]
 * @return {[promise]}         [resolves on successful download]
 */
exports.downloadFile = function(filepath, word) {
  return new BbPromise(function(resolve, reject) {

    var params = {
      // localFile: path.join(filepath, word.word + '.wav'),
      localFile: filepath,

      s3Params: {
        Bucket: word.s3.Bucket,
        Key: word.s3.Key
      }
    };
    var downloader = client.downloadFile(params);
    downloader.on('error', function(err) {
      console.error("unable to download:", err.stack);
    });
    downloader.on('progress', function() {
      // console.log("progress", downloader.progressAmount, downloader.progressTotal);
    });
    downloader.on('end', function() {
      // console.log("done downloading");
      resolve();
    });
  });
};

/**
 * Removes all words matching the query from DB
 * AND from s3
 * @param  {[object]} query [mongoDB query]
 * @return {[promise]}      [promise object]
 */
exports.removeWordsByQuery = function(query) {
  return exports.openDbConnection()
    .then(function() {
      // Find matching words
      return Word.find(query);
    })
    .then(function(words) {
      // Remove words from S3
      return exports.removeS3File(words);
    })
    .then(function() {
      // Delete words from DB
      return Word.remove(query, function() {
        //console.log('words deleted from db');
      });
    })
    .catch(function(err) {
      console.log(err);
    })
    .finally(function() {
      exports.closeDbConnection();
    });
};

/**gul
 * Finds a file on Amazon S3 and pipes a readstream to the response object
 * Requires req.params.filename to be set to a file on S3
 * @return {[stream]}        [pipes stream to the response]
 */
exports.downloadStream = function(req, res, next) {

  var params = {
    Bucket: config.bucket,
    Key: req.params.filename
  };

  var downloadStream = client.downloadStream(params);

  downloadStream.on('error', function() {
    res.status(404).send('Not Found');
  });
  downloadStream.on('httpHeaders', function(statusCode, headers, resp) {
    // Set Headers
    res.set({
      'Content-Type': headers['content-type']
    });
  });

  // Pipe download stream to response
  downloadStream.pipe(res);
};

/**
 * Removes a list of words from S3
 * @param  {[array]} words [list of words to remove]
 * @return {[promise]}     [resolves on successful removal]
 */
exports.removeS3File = function(words) {

  return new BbPromise(function(resolve, reject) {

    // Map word keys
    var objects = words.map(function(word) {
      return {
        Key: word.s3.Key
      };
    });

    // Set up s3 object
    var params = {
      Bucket: config.bucket,
      Delete: {
        Objects: objects
      }
    };

    var deleter = client.deleteObjects(params);

    deleter.on('end', function() {
      //console.log(words.length + ' words deleted from s3');
      resolve();
    });
    deleter.on('error', function(err) {
      //console.log('error');
      reject(err);
    });
  });
};

/**
 * Opens a new mongoose db connection
 * @return {[type]} [description]
 */
exports.openDbConnection = function() {
  return new BbPromise(function(resolve, reject) {

    mongoose.connect(config.mongoURI);

    mongoose.connection.on('connected', function() {
      console.log('connected to db');
      resolve(mongoose.connection);
    });

    mongoose.connection.on('error', function(err) {
      reject(err);
    });

  });
};

/**
 * Closes db connection
 * @return {[type]} [description]
 */
exports.closeDbConnection = function() {
  mongoose.connection.close();
};

/**
 * Add a new word to the app
 * Uploads file to Amazon S3 and saves the word to the DB
 * @param  {[string]} file   [file path of wav file]
 * @param  {[object]} params [{word:String, language: String, accent: String, gender: String}]
 * @return {[promise]}       [resolves on successful save]
 */
exports.uploadWordAndSave = function(file, params) {
  var scoresPath = file.replace(/\.wav$/, '.txt');
  var scores = exports.getScoresFromFile(scoresPath).then(function(scores) {
  //   console.log(scores);
  // });

    // Create new word object
    // word defaults to filename
    var word = new Word({
      word: params.word || path.parse(file).name,
      language: params.language,
      accent: params.accent,
      gender: params.gender,
      scores: scores,
      s3: {
        Bucket: config.bucket,
        Key: path.parse(file).base
      }
    });
    return word.save()
      .then(function() {
        // Upload file to s3 on successful save to DB
        return exports.uploadFile(file, word);
      }).catch(function(err) {
        return BbPromise.reject(err);
      });
  });


};

exports.getScoresFromFile = function(file, callback) {
  return new BbPromise(function(fulfill, reject) {
    readFile(file, "utf-8").then(function(data) {
      var scores = data.split('\n');
      scores = scores.filter(Boolean);  // Gets rid of empty elements
      scores = scores.map(function(score) {
        return parseFloat(score);
      });
      fulfill(scores);
    });
  });
};
