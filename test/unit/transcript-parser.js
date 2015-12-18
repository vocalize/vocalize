process.env.NODE_ENV = 'test';

var path = require('path');
var fs = require('fs');
var path = require('path');
var mockery = require('mockery');
var Promise = require('bluebird');
var expect = require('chai').expect;
var sinon = require('sinon');
var util = require('../util');

var transcript_parser;

var videoId = '1ndYA_32dFo';

var mockConfig = {
  username: 'fake',
  password: 'superfake',
  inputDir: path.join(__dirname, '..', 'testfiles', 'transcript-parser')
};

var inputDir = mockConfig.inputDir;

describe('transcript parser', function() {
  var watsonStub, files;

  before(function(done) {

    mockery.enable({
      warnOnUnregistered: false,
      useCleanCache: true
    });
    mockery.registerMock('./config/config', mockConfig);
    transcript_parser = require('../../dataScraping/lib/transcript-parser');

    files = fs.readdirSync(path.join(inputDir, videoId));

    watsonStub = sinon.stub(transcript_parser, '_watsonStream', function() {
      return Promise.resolve();
    });

    transcript_parser.getTranscript(videoId, inputDir)
      .then(function() {
        done();
      });
  });

  after(function() {
    transcript_parser._watsonStream.restore();
    mockery.disable();
    mockery.deregisterAll();
  });

  it('is a function', function() {
    expect(transcript_parser.getTranscript).to.be.a('function');
  });

  it('should get a transcript for each file in input dir', function() {
    var files = fs.readdirSync(path.join(inputDir, videoId));
    expect(watsonStub.callCount).to.equal(files.length);
  });

  it('should call _watsonStream with correct filepath and transcript directory', function() {
    var filePath = path.join(inputDir, videoId, files[0]);
    var transcriptPath = path.join(inputDir, videoId, 'transcripts');
    expect(watsonStub.calledWith(filePath, transcriptPath)).to.equal(true);
  });

});
