var s3 = require('s3');
var BbPromise = require('bluebird');
var path = require('path');
var fs = require('fs');
var config = require('./config');

var client = s3.createClient({
  s3Options: {
    accessKeyId: config.key,
    secretAccessKey: config.secret
  }
});

/**
 * Upload a file to Amazon S3
 * File assumed to be in the same directory
 * @param  {[string]} filename [file to be upload]
 * @return {[promise]}         [resolves on successful upload]
 */
exports.uploadFile = function(filename) {
  return new BbPromise(function(resolve, reject) {
    var filepath = path.join(__dirname, filename);

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
