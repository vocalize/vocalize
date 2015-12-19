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
    var words, subdir;

    before(function(done) {
      audio_parser(videoId).then(function() {
        words = fs.readdirSync(outputDir);
        subdir = fs.readdirSync(path.join(outputDir, words[0]));
        done();
      });
    });

    it('should create directories for each word', function(done) {
      expect(words.length).to.equal(3);
      expect(words[0]).to.equal('apple');
      // Subdir should have audio file, standard folder, and word file
      expect(subdir).to.eql(['0apple.wav', 'standard', 'word.txt']);
      done();
    });

    it('should create a standard directory and a word.txt file in each directory', function(done) {
      words.forEach(function(word) {
        var sub = fs.readdirSync(path.join(outputDir, word));
        expect(sub.indexOf('standard')).to.not.equal(-1);
        expect(sub.indexOf('word.txt')).to.not.equal(-1);
      })
      done()
    });

    it('should not create a new directory for a word that exists', function(done) {
      audio_parser(videoId)
        .then(function() {
          words = fs.readdirSync(outputDir);
          expect(words.length).to.equal(3);
          done()
        });
    });

  });

  describe('handles errors', function() {

    it('should catch an error for a directory that does not exist', function(done) {
      audio_parser('fake')
        .then(function() {
          done();
        });
    });

    it('should catch an error when there is no transcript', function(done) {
      audio_parser('fail')
        .then(function() {
          done();
        });
    });

  });


});
