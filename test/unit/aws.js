process.env.NODE_ENV = 'test';

var expect = require('chai').expect;
var sinon = require('sinon');
var Promise = require('bluebird');
var path = require('path');
var fs = require('fs');
var mongoose = require('mongoose');
var mockrequire = require('mockrequire');
var EventEmitter = require('events').EventEmitter;

var aws = require('../../app/aws/aws');

var config = require('../config');
var Word = require('../../app/models/word');
var Counter = require('../../app/models/counter');

var testdir = config.aws;
var testfile = path.join(testdir, 'circle.wav');
var badfile = path.join(testdir, 'fake.wav');
var params = JSON.parse(fs.readFileSync(path.join(testdir, 'params.json')));

var mock = function(){
  return Promise.resolve();
};

describe('aws', function() {

  var openDbConnection, closeDbConnection, removeS3File, uploadFile, downloadFile;

  beforeEach(function(done) {
    // Open DB connection
    mongoose.connect('mongodb://localhost/vocalizetest');
    mongoose.connection.once('open', function() {

      // Stub connection function
      openDbConnection = sinon.stub(aws, 'openDbConnection', mock);
      uploadFile = sinon.stub(aws, 'uploadFile', mock);
      downloadFile = sinon.stub(aws, 'downloadFile', mock);
      removeS3File = sinon.stub(aws, 'removeS3File', mock);

      // Stub connection function
      closeDbConnection = sinon.stub(aws, 'closeDbConnection');

      done();
    });
  });

  afterEach(function(done) {

    // Restore stubbed functions
    aws.openDbConnection.restore();
    aws.closeDbConnection.restore();
    aws.uploadFile.restore();
    aws.downloadFile.restore();
    aws.removeS3File.restore();

    mongoose.connection.db.dropDatabase(function(err, result) {
      mongoose.connection.close();
      done();
    });
  });

  it('should connect to the db', function(done) {
    Word.find({})
      .then(function(words) {
        expect(words.length).to.equal(0);
        done();
      });
  });

  describe('addWordsByDir', function() {


    it('should be a function', function() {
      expect(aws.addWordsByDir).to.be.a('function');
    });

    it('should establish a connection to the db and close it when finished', function(done) {
      aws.addWordsByDir(testdir)
        .then(function() {
          expect(openDbConnection.callCount).to.equal(1);
          expect(closeDbConnection.callCount).to.equal(1);
          done();
        });
    });

    it('should upload files from a directory and save the words to the db', function(done) {
      aws.addWordsByDir(testdir)
        .then(function() {
          Word.find()
            .then(function(words) {
              expect(uploadFile.callCount).to.equal(4);
              expect(words.length).to.equal(4);
              done();
            });
        });
    });

    it('should reject a directory that does not exist', function(done) {
      aws.addWordsByDir(testdir + '123fakestreet')
        .catch(function(err) {
          Word.find()
            .then(function(words) {
              expect(uploadFile.callCount).to.equal(0);
              expect(words.length).to.equal(0);
              done();
            });
        });
    });

    it('should reject a directory without a params.json file', function(done) {
      aws.addWordsByDir(__dirname)
        .catch(function(err) {
          Word.find()
            .then(function(words) {
              expect(uploadFile.callCount).to.equal(0);
              expect(words.length).to.equal(0);
              done();
            });
        });
    });

  });


  describe('addWord', function() {

    it('should be a function', function() {
      expect(aws.addWord).to.be.a('function');
    });

    it('should establish a connection to the db and close it when finished', function(done) {
      aws.addWord(testfile, params)
        .then(function() {
          expect(openDbConnection.callCount).to.equal(1);
          expect(closeDbConnection.callCount).to.equal(1);
          done();
        });
    });

    it('should upload files from a directory and save the words to the db', function(done) {
      aws.addWord(testfile, params)
        .then(function() {
          Word.find()
            .then(function(words) {
              expect(uploadFile.callCount).to.equal(1);
              expect(words.length).to.equal(1);
              done();
            });
        });
    });

    it('should reject a file that does not exist', function(done) {
      aws.addWord(badfile, params)
        .catch(function(err) {
          Word.find()
            .then(function(words) {
              expect(uploadFile.callCount).to.equal(0);
              expect(words.length).to.equal(0);
              done();
            });
        });
    });

  });

  describe('uploadFile', function() {

    var uploadSpy;

    beforeEach(function() {
      uploadSpy = sinon.spy(Client, 'uploadFile');
    });

    afterEach(function() {
      Client.uploadFile.restore();
    });

    it('should be a function', function() {
      expect(aws.uploadFile).to.be.a('function');
    });

    it('should create a params object with filepath and s3 locations', function(done) {
      var params = {
        localFile: 'filepath',
        s3Params: {
          Bucket: 'hr10-vocalize-testing',
          Key: 'filekey'
        }
      };

      aws.uploadFile('filepath', {
          s3: {
            Key: 'filekey'
          }
        })
        .then(function() {
          console.log('params:', params);
          expect(uploadSpy.calledWith(params)).to.equal(true);
          done();
        });
    });

  });

  describe('dowloadFile', function() {

    var downloadSpy;

    beforeEach(function() {
      downloadSpy = sinon.spy(Client, 'downloadFile');
    });

    afterEach(function() {
      Client.downloadFile.restore();
    });

    it('should be a function', function() {
      expect(aws.downloadFile).to.be.a('function');
    });

    it('should create a params object with filepath and s3 locations', function(done) {
      var params = {
        localFile: 'filepath',
        s3Params: {
          Bucket: 'filebucket',
          Key: 'filekey'
        }
      };

      aws.downloadFile('filepath', {
          s3: {
            Bucket: 'filebucket',
            Key: 'filekey'
          }
        })
        .then(function() {
          expect(downloadSpy.calledWith(params)).to.equal(true);
          done();
        });
    });

  });



});
