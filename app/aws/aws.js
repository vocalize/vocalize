var s3 = require('s3');
var BbPromise = require('bluebird');
var path = require('path');
var fs = require('fs');
var mongoose = require('mongoose');
var config = require('./config');
var util = require('../util');

var readFile = BbPromise.promisify(fs.readFile);
var readdir = BbPromise.promisify(fs.readdir);

var Word = require('../models/word');

var client = s3.createClient({
  s3Options: {
    accessKeyId: config.key,
    secretAccessKey: config.secret
  }
});

exports.addWordsByDir = function(directory){

  var params,
      metadataFile = path.join(directory, 'meta.json');
      
  return readFile(metadataFile)
    .then(function(data){

      params = JSON.parse(data);
      return readdir(directory);
    })
    .then(function(files){
      
      files = files.filter(function(file){
        return path.parse(file).ext === '.wav';
      });

      return BbPromise.each(files, function(file){
        var filepath = path.join(directory, file);
        return exports.addWord(filepath, params);
      });

    })
    .then(console.log.bind(this, 'Words successfully added from ' + directory))
    .catch(function(err){
      console.log('Error adding files from ' + directory);
    });
};

/**
 * Add a new word to the app
 * Uploads file to Amazon S3 and saves the word to the DB
 * Filename must be unique!
 * @param  {[string]} file   [file path of wav file]
 * @param  {[object]} params [{word:String, language: String, accent: String, gender: String}]
 * @return {[promise]}       [resolves on successful save]
 */
exports.addWord = function(file, params) {

  mongoose.connect('mongodb://localhost/vocalize');

  mongoose.connection.on('connected', function() {
    console.log('Connected to DB');

    var word = new Word({
      word: params.word,
      language: params.language,
      accent: params.accent,
      gender: params.gender,
      s3: {
        Bucket: config.bucket,
        Key: path.parse(file).base
      }
    });

    return exports.uploadFile(file)
      .then(word.save)
      .then(function(){
        console.log(file + ' successfully saved and uploaded!');
      }).finally(function(){
        mongoose.connection.close();
      }).catch(function(err){
        console.error(err);
      });
  });
};

/**
 * Upload a file to Amazon S3
 * File assumed to be in the same directory
 * @param  {[string]} filename [file to be upload]
 * @return {[promise]}         [resolves on successful upload]
 */
exports.uploadFile = function(filepath) {
  return new BbPromise(function(resolve, reject) {
    console.log('uploading ' + filepath);
    var params = {
      localFile: filepath,

      s3Params: {
        Bucket: config.bucket,
        Key: path.parse(filepath).base
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
      console.log("done uploading");
      resolve();
    });
  });
};

/**
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
    res.set({
      'Content-Type': headers['content-type']
    });
  });

  downloadStream.pipe(res);
};
