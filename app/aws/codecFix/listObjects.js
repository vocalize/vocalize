var s3 = require('s3');
var spawn = require('child_process').spawn;
var BbPromise = require('bluebird');
var path = require('path');
var fs = require('fs');
var config = require('./config');
var util = require('../util');

var inputDir = path.join(__dirname, 'inputDir');
var outputDir = path.join(__dirname, 'outputDir');

var bucket = 'hr10-vocalize-testing'


// Set up s3 credentials
var client = s3.createClient({
  s3Options: {
    accessKeyId: config.key,
    secretAccessKey: config.secret
  }
});

var inputParams = {
  s3Params: {
    Bucket: bucket,
    Prefix: 'public/'
  }
};

var outputParams = {
  s3Params: {
    Bucket: bucket,
    Prefix: 'fix/'
  }
};

client.listObjects(inputParams)
  .on('data', function(data) {
    
  })
  .on('end', function() {
    console.log('done');
  });


var downloadFile = function(s3Key){
  var params = {
    localFile: path.join(inputDir, s3Key),

    s3Params:{
      Bucket: bucket,
      Key: s3Key
    }
  };

  var downloader = client.downloadFile(params)
    .on('error', function(err){
      console.error('download error', err);
    })
    .on('end', function(){
      console.log('done downloading ' + s3Key);
    });
};

var uploadFile = function(){

};

