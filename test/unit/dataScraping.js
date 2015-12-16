var expect = require('chai').expect;
var audio_parser = require('../../dataScraping/lib/audio-parser');
var standardise_word_length = require('../../dataScraping/lib/standardise-word-length');
var transcript_parser = require('../../dataScraping/lib/transcript-parser');
var util = require('../../dataScraping/lib/util');
var wordlist_parser = require('../../dataScraping/lib/wordlist-parser');
var youtube_scraper = require('../../dataScraping/lib/youtube-scraper');

describe('data scraping', function() {
  it('works', function() {
    expect(true).to.not.equal(false);       // Check for opposite day
  });

  describe('audio parser', function() {
    it('is a function', function() {
      expect(audio_parser).to.be.a('function');
    });
  });
  
  describe('standardise word length', function() {
    it('is a function', function() {
      expect(standardise_word_length).to.be.a('function');
    });
  });

  describe('transcript parser', function() {
    it('is a function', function() {
      expect(transcript_parser).to.be.a('function');
    });
  });

  describe('util', function() {
    it('has an exists function', function() {
      expect(util.exists).to.be.a('function');
    });
    it('has a mkdir function', function() {
      expect(util.mkdir).to.be.a('function');
    });
    it('has an readdir function', function() {
      expect(util.readdir).to.be.a('function');
    });
    it('has an getFilename function', function() {
      expect(util.getFilename).to.be.a('function');
    });
    it('has an handleError function', function() {
      expect(util.handleError).to.be.a('function');
    });
    it('has an countSyllables function', function() {
      expect(util.countSyllables).to.be.a('function');
    });
  });

  describe('wordlistParser function', function() {
    it('has a textToJson function', function(){
      expect(wordlist_parser.textToJson).to.be.a('function');
    });
    it('has a getWordList function', function() {
      expect(wordlist_parser.getWordList).to.be.a('function');
    });
  });

  describe('youtube scraper', function() {
    it('is a function', function() {
      expect(youtube_scraper).to.be.a('function');
    });
  });
});