process.env.NODE_ENV = 'test';

var path = require('path');
var fs = require('fs');
var path = require('path');
var mockery = require('mockery');
var ffmpeg = require('fluent-ffmpeg');
var Promise = require('bluebird');
var expect = require('chai').expect;
var config = require('../config');
var util = require('../util');

var standardise_word_length;

var mockConfig = {
  outputDir: path.join(__dirname, '..', 'testfiles', 'standardise-word-length')
};

var outputDir = mockConfig.outputDir;
var wordDir = path.join(outputDir, 'able');
var standard = path.join(wordDir, 'standard');

describe('standardise word length', function() {

  before(function() {
    mockery.enable({
      warnOnUnregistered: false,
      useCleanCache: true
    });
    mockery.registerMock('./config/config', mockConfig);
    standardise_word_length = require('../../dataScraping/lib/standardise-word-length');
  });

  after(function() {
    mockery.disable();
    mockery.deregisterAll();
  });


  it('works', function() {
    expect(true).to.not.equal(false); // Check for opposite day
  });

  it('is a function', function() {
    expect(standardise_word_length).to.be.a('function');
  });

  describe('functions', function() {

    before(function(done) {
      fs.mkdirSync(standard);

      standardise_word_length()
        .then(function() {
          done();
        });
    });

    after(function() {
      // Remove standard dir
      util.rmdirRf(standard);
    });

    it('should create a new file in standard for each file in directory', function(done) {
      var before = fs.readdirSync(wordDir).filter(function(file) {
        return path.parse(file).ext === '.wav';
      });
      var after = fs.readdirSync(standard);
      expect(before).to.eql(after);
      done();
    });

    it('should have inputs with non standard lengths', function(done) {
      var files = fs.readdirSync(wordDir);

      var probes = files.filter(function(file) {
          return path.parse(file).ext === '.wav';
        })
        .map(function(file) {
          file = path.join(wordDir, file);
          return new Promise(function(resolve, reject) {
            ffmpeg.ffprobe(file, function(err, metadata) {
              if (err) {
                reject(err);
              }
              resolve(metadata.format.duration);
            });
          });
        });
      // Within a tenth of a second
      return Promise.map(probes, function(probe) {
          return probe.toFixed(1);
        })
        .then(function(durations) {
          var same = durations.reduce(function(same, cur) {
            if (same) {
              same = (same === cur) ? cur : false;
            }
            return same;
          });
          expect(same).to.equal(false);
          done();
        });

    });

    it('should make each file the same length', function(done) {
      var files = fs.readdirSync(standard);

      var probes = files.map(function(file) {
        file = path.join(standard, file);
        return new Promise(function(resolve, reject) {
          ffmpeg.ffprobe(file, function(err, metadata) {
            if (err) {
              reject(err);
            }
            resolve(metadata.format.duration);
          });
        });
      });
      // Within a tenth of a second
      return Promise.map(probes, function(probe) {
          return probe.toFixed(1);
        })
        .then(function(durations) {
          durations.reduce(function(prev, cur) {
            expect(prev).to.equal(cur);
            return cur;
          });
          done();
        });
    });

  });
});
