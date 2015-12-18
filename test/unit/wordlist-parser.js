process.env.NODE_ENV = 'test';

var fs = require('fs');
var path = require('path');
var mockery = require('mockery');
var expect = require('chai').expect;
var wordlist_parser;

var mockConfig = {
  wordListDir: path.join(__dirname, '../testfiles/word-lists')
};

describe('wordlistParser function', function() {

  before(function(done) {
    mockery.enable({
      warnOnUnregistered: false,
      useCleanCache: true
    });
    mockery.registerMock('./config/config', mockConfig);
    wordlist_parser = require('../../dataScraping/lib/wordlist-parser');

    wordlist_parser.textToJson('test.txt')
      .then(function() {
        done();
      });
  });

  after(function() {
    fs.unlink(mockConfig.wordListDir + '/test.json');
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('textToJson', function() {

    it('has a textToJson function', function() {
      expect(wordlist_parser.textToJson).to.be.a('function');
    });

    it('should create a json file', function() {
      var files = fs.readdirSync(mockConfig.wordListDir);
      expect(files.sort()).to.eql(['test.txt', 'test.json'].sort());
    });

    it('should create a json object with words for keys', function() {
      var json = fs.readFileSync(mockConfig.wordListDir + '/test.json');
      expect(JSON.parse(json)).to.eql({
        head: true,
        stand: true
      });
    });

  });

  describe('getWordList', function() {

    it('has a getWordList function', function() {
      expect(wordlist_parser.getWordList).to.be.a('function');
    });

    it('should return an object given a json filepath', function() {
      var obj = wordlist_parser.getWordList('test');
      expect(obj).to.eql({
        head: true,
        stand: true
      });
    });
  });

});
