process.env.NODE_ENV = 'test';

var expect = require('chai').expect;
var sinon = require('sinon');
var Promise = require('bluebird');
var http = require('http');
var path = require('path');
var fs = require('fs');
var mongoose = require('mongoose');
var request = require('request');

var aws = require('../../app/aws/aws');

var util = require('../util');

var filepath = path.join(__dirname, '..', 'testfiles/aws');
var testfile = path.join(filepath, 'circle.wav');
var url = 'http://d2oh9tgz5bro4i.cloudfront.net/circle.wav';

var testword = {
  s3: {
    Bucket: 'hr10-vocalize-testing',
    Key: 'public/circle.wav'
  }
};


describe('aws live', function() {

  before(function(done) {
    mongoose.connect('mongodb://localhost/vocalizetest');
    mongoose.connection.once('open', function() {
      done();
    });
  });

  after(function(done) {
    if (util.exists(path.join(filepath, 'temp', 'test.wav'))) {
      fs.unlink(path.join(filepath, 'temp', 'test.wav'));
    }
    mongoose.connection.db.dropDatabase(function(err, result) {
      mongoose.connection.close();
      done();
    });
  });

  describe('uploadFile', function() {

    xit('should upload a file to s3', function(done) {

      aws.uploadFile(testfile, testword)
        .then(function() {
          done();
        }).catch(function(err) {
          console.log(err);
        });
    });
  });

  describe('downloadFile', function() {

    xit('should download a file from s3', function(done) {

      aws.downloadFile(filepath + '/temp/test.wav', testword)
        .then(function() {
          var files = fs.readdirSync(path.join(filepath, 'temp'));
          expect(files.indexOf('test.wav')).to.not.equal(-1);
          done();
        }).catch(function(err) {
          console.log(err);
        });
    });

    xit('should have a valid streaming url', function(done) {
      
      request(url, function(err, resp, body){
        expect(resp.statusCode === 200);
        done();
      });

    });

  });

  describe('removeS3File', function() {

    xit('should remove a file from s3', function(done) {

      aws.removeS3File([testword])
        .then(function() {
          done();
        }).catch(function(err) {
          console.log(err);
        });
    });

  });
});
