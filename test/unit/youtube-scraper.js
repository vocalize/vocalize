process.env.NODE_ENV = 'test';

var path = require('path');

var fs = require('fs');
var Promise = require('bluebird');
var path = require('path');
var ffmpeg = require('fluent-ffmpeg');
var expect = require('chai').expect;
var mockery = require('mockery');
var sinon = require('sinon');
var EventEmitter = require('events').EventEmitter;
var config = require('../config');
var util = require('../util');

var youtube_scraper;

// Set up test file directories
var mockConfig = {
  inputDir: path.join(__dirname, '..', 'testfiles/youtube-scraper'),
  audioChunkLength: 10
};

// Set up tes variables
var videoId = 'videoId';
var testfile = path.join(mockConfig.inputDir, videoId + '.mp3');
var processingDir = path.join(mockConfig.inputDir, videoId);

describe('youtube-scraper', function() {
  var downloadStub;

  before(function(done) {
    // Set up Mockery
    mockery.enable({
      warnOnUnregistered: false,
      useCleanCache: true
    });
    // Replace config module with our mockConfig
    mockery.registerMock('./config/config', mockConfig);
    youtube_scraper = require('../../dataScraping/lib/youtube-scraper');
    // Stub out youtube_dl function so we don't actually download anything
    downloadStub = sinon.stub(youtube_scraper, 'youtube_dl', function() {
      return Promise.resolve();
    });

    // Run function
    youtube_scraper.download(videoId)
      .then(function() {
        done();
      });
  });

  after(function() {
    // Teardown mockery
    mockery.deregisterAll();
    mockery.disable();
    // Restore stub
    youtube_scraper.youtube_dl.restore();
    // Clean up files
    util.rmdirRf(processingDir);
  });

  it('should be a function', function() {
    expect(youtube_scraper.download).to.be.a('function');
  });

  it('should download a file', function() {
    expect(downloadStub.callCount).to.equal(1);
  });

  it('should be called with the correct params', function() {
    expect(downloadStub.calledWith(videoId, mockConfig.inputDir)).to.equal(true);
  });

  it('should create a transcript folder in the new directory', function() {
    var files = fs.readdirSync(processingDir);
    expect(files.indexOf('transcripts')).to.not.equal(-1);
  });

  it('should split the audio file into chunks', function(done) {
    var files = fs.readdirSync(processingDir).filter(function(file){
      return path.parse(file).ext === '.flac';
    });

    // Check the number of files matches video length / chunk size
    ffmpeg.ffprobe(testfile, function(err, meta){
      var chunks = Math.ceil(meta.format.duration / mockConfig.audioChunkLength);
      expect(files.length).to.equal(chunks);
      done();
    });
  });

});
