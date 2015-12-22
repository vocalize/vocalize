process.env.NODE_ENV = 'test';

var path = require('path');
var fs = require('fs');
var path = require('path');
var mockery = require('mockery');
var expect = require('chai').expect;
var util = require('../util');
var audio_parser;

var videoId = 'VKUyezKHNXk';

var mockConfig = {
  inputDir: path.join(__dirname, '..', 'testfiles', 'audio-parser', 'input'),
  outputDir: path.join(__dirname, '..', 'testfiles', 'audio-parser', 'output'),
  wordListDir: path.join(__dirname, '..', '..', 'dataScraping/word-lists')
};

var inputDir = path.join(mockConfig.inputDir);
var outputDir = path.join(mockConfig.outputDir);

describe('audio parser', function() {

  before(function() {
    mockery.enable({
      warnOnUnregistered: false,
      useCleanCache: true
    });
    mockery.registerMock('./config/config', mockConfig);
    audio_parser = require('../../dataScraping/lib/audio-parser');
    // Creat output dir
    fs.mkdirSync(outputDir);
  });

  after(function() {
    // Remove output dir
    util.rmdirRf(outputDir);
    mockery.deregisterAll();
    mockery.disable();
  });

  it('works', function() {
    expect(true).to.not.equal(false); // Check for opposite day
  });

  it('is a function', function() {
    expect(audio_parser).to.be.a('function');
  });

  describe('functions', function() {

    before(function(done) {
      audio_parser(videoId, 'english')
        .then(function() {
          return audio_parser(videoId, 'spanish');
        })
        .then(function() {
          done();
        });
    });

    it('should create a directory for each language', function(done) {
      var language_directories = fs.readdirSync(path.join(outputDir));
      expect(language_directories).to.include.members(['english', 'spanish']);
      done();
    });

    it('should create directories for each word', function(done) {
      var word_directories = fs.readdirSync(path.join(outputDir, 'english'));
      expect(word_directories.length).to.equal(3);
      expect(word_directories).to.include.members(['apple', 'circle', 'board']);
      done();
    });

    it('should create an audio file for each word', function(done) {
      var apple = fs.readdirSync(path.join(outputDir, 'english', 'apple'));
      expect(apple).to.include.members(['0apple.wav']);
      done()
    });

    it('should create an audio file, a standard directory and a word.txt file in each directory', function(done) {
      var word_directories = fs.readdirSync(path.join(outputDir, 'english'));

      word_directories.forEach(function(word) {
        var sub = fs.readdirSync(path.join(outputDir, 'english', word));
        expect(sub).to.include.members(['standard', 'word.txt']);
      })
      done()
    });

    it('should not create a new directory for a word that exists', function(done) {
      audio_parser(videoId, 'english')
        .then(function() {
          word_directories = fs.readdirSync(path.join(outputDir, 'english'));
          expect(word_directories.length).to.equal(3);
          done()
        });
    });

  });

  describe('handles errors', function() {

    it('should throw an error if no video id is specified', function(done) {
      audio_parser()
        .catch(function() {
          done();
        });
    });

    it('should throw an error if no language is specified', function(done) {
      audio_parser(videoId)
        .catch(function() {
          done();
        });
    });

    it('should throw an error for a directory that does not exist', function(done) {
      audio_parser('fake', 'english')
        .catch(function() {
          done();
        });
    });

    it('should throw an error when there is no transcript', function(done) {
      audio_parser('fail', 'english')
        .catch(function() {
          done();
        });
    });

  });


});
