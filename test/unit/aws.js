process.env.NODE_ENV = 'test';

var expect = require('chai').expect;
var sinon = require('sinon');
var Promise = require('bluebird');
var path = require('path');
var fs = require('fs');
var mongoose = require('mongoose');

var aws = require('../../app/aws/aws');
var Word = require('../../app/models/word');
var Counter = require('../../app/models/counter');

var testdir = path.join(__dirname, '..', 'testwords');
var testfile = path.join(__dirname, '..', 'testwords', 'circle.wav');
var badfile = path.join(__dirname, '..', 'testwords', 'fake.wav');
var params = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'testwords', 'params.json')));

describe('aws', function() {

  var uploadFile, openDbConnection, closeDbConnection, removeS3File;

  beforeEach(function(done) {
    // Open DB connection
    mongoose.connect('mongodb://localhost/vocalizetest');
    mongoose.connection.once('open', function() {

      // Stub connection function
      openDbConnection = sinon.stub(aws, 'openDbConnection', function() {
        return Promise.resolve();
      });

      // Stub connection function
      closeDbConnection = sinon.stub(aws, 'closeDbConnection');

      removeS3File = sinon.stub(aws, 'removeS3File', function(){
        return Promise.resolve();
      });

      // Stub upload to AWS function
      uploadFile = sinon.stub(aws, 'uploadFile', function() {
        return Promise.resolve();
      });

      done();
    });
  });

  afterEach(function(done) {

    // Restore stubbed functions
    aws.openDbConnection.restore();
    aws.closeDbConnection.restore();
    aws.uploadFile.restore();
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

    it('should be a function', function() {
      expect(aws.uploadFile).to.be.a('function');
    });

  });

  describe('dowloadFile', function() {

    it('should be a function', function() {
      expect(aws.downloadFile).to.be.a('function');
    });

  });

  describe('removeWordsByQuery', function() {

    it('should be a function', function() {
      expect(aws.removeWordsByQuery).to.be.a('function');
    });

    it('should establish a connection to the db and close it when finished', function(done) {
      aws.removeWordsByQuery({})
        .then(function() {
          expect(openDbConnection.callCount).to.equal(1);
          expect(closeDbConnection.callCount).to.equal(1);
          done();
        });
    });

    it('should remove words from S3 and delete them from the DB', function(done) {
      aws.addWordsByDir(testdir)
        .then(function() {
          return Word.find({});
        })
        .then(function(words){
          expect(words.length).to.equal(4);
          return aws.removeWordsByQuery({language: 'english'});
        })
        .then(function(){
          expect(removeS3File.callCount).to.equal(1);
          expect(removeS3File.firstCall.args[0].length).to.equal(4);
          return Word.find();
        })
        .then(function(words){
          expect(words.length).to.equal(0);
          done();
        });
    });

  });

  describe('downloadStream', function() {

    it('should be a function', function() {
      expect(aws.downloadStream).to.be.a('function');
    });

  });

});
