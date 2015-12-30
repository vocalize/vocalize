var s3 = require('s3');
var Promise = require('bluebird');
var path = require('path');
var fs = require('fs');
var ffmpeg = require('fluent-ffmpeg');
var config = require('../config');
var util = require('../../util');


var inputDir = path.join(__dirname, 'inputDir');
var outputDir = path.join(__dirname, 'outputDir');
var inputBucket = 'hr10-vocalize';
var outputBucket = 'hr10-vocalize-production'

// Set up s3 credentials
var client = s3.createClient({
  s3Options: {
    accessKeyId: config.key,
    secretAccessKey: config.secret
  }
});

var inputParams = {
  s3Params: {
    Bucket: inputBucket,
    Prefix: 'public/'
  }
};

var outputParams = {
  s3Params: {
    Bucket: outputBucket,
    Prefix: 'fix/'
  }
};

client.listObjects(inputParams)
  .on('data', function(data) {
    var commands = data.Contents.filter(function(obj){
      return path.parse(obj.Key).ext === '.wav';
    })
    .map(function(obj) {
      console.log(obj.Key);
      return downloadFile(obj.Key)
                .then(convertFile)
                .then(uploadFile);
    });

    Promise.map(commands, function(command){
      return command();
    }, {concurrency: 10})
    .then(function(){
      console.log('all done bro');
    }).catch(function(err){
      console.error(err);
    });
  })
  .on('end', function() {
    console.log('done');
  });


var downloadFile = function(s3Key){
  return new Promise(function(resolve, reject){
    console.log('downloading ', s3Key);

    var localFile = path.join(inputDir, s3Key)

    var params = {
      localFile: localFile,

      s3Params: {
        Bucket: inputBucket,
        Key: s3Key
      }
    };

    client.downloadFile(params)
      .on('error', function(err){
        reject(err);
      })
      .on('end', function(){
        console.log('done downloading ', s3Key);
        resolve(localFile)
      });
  });
};

var convertFile = function(localFile) {
  return new Promise(function(resolve, reject){

    console.log('converting ', localFile);
    var s3Key = path.parse(localFile).base;
    var outputFile = path.join(outputDir, s3Key);

    ffmpeg(localFile)
      .audioCodec('pcm_f32le')
      .output(outputFile)
      .on('error', function(err) {
        reject(err);
      })
      .on('end', function() {
        console.log('Converted ' + path.parse(localFile).name);
        resolve(outputFile);
      })
      .run();
  });
};

var uploadFile = function(filepath){
  return new Promise(function(resolve, reject){

    console.log('uploading ', filepath);

    var key = path.parse(filepath).base;

    var params = {
      localFile: filepath,

      s3Params: {
        Bucket: outputBucket,
        Key: 'public/' + key
      }
    };

    client.uploadFile(params)
      .on('error', function(err){
        reject(err);
      })
      .on('end', function(){
        console.log('done uploading ', key);
        resolve();
      });
  });
};


