process.env.NODE_ENV = 'test';

var request = require('supertest');
var express = require('express');
var mongoose = require('mongoose');
var expect = require('chai').expect;
var db = require('../../app/config');
var app = require('../../server');

var Word = require('../../app/models/word');
var Counter = require('../../app/models/counter');

describe('Routes', function() {

  var con;

  before(function(done) {
    con = mongoose.createConnection('mongodb://localhost/vocalizetest');

    Word.remove({})
      .then(function() {
        return Counter.remove({});
      })
      .then(function() {
        Word.create({
          word: 'apple',
          language: 'english',
          accent: 'general',
          gender: 'male',
          s3: {
            Bucket: 'hr10-vocalize-testing',
            Key: 'apple.wav'
          }
        });
      })
      .then(function() {
        Word.create({
          word: 'circle',
          language: 'english',
          accent: 'general',
          gender: 'male',
          s3: {
            Bucket: 'hr10-vocalize-testing',
            Key: 'circle.wav'
          }
        });
      })
      .then(function() {
        done();
      });
  });

  after(function(done) {
    con.db.dropDatabase(function(err, result) {
      con.close(done);
    });
  });

  it('should load the index', function(done) {
    request(app)
      .get('/')
      .expect(200)
      .end(done);
  });

  it('should have two words on the db', function(done) {
    Word.find({})
      .then(function(words) {
        expect(words.length).to.equal(2);
        done();
      });
  });

  describe('Words API', function() {

    describe('/api/words/', function() {

      it('should find an existing word by query string', function(done) {
        request(app)
          .get('/api/words?word=apple')
          .expect(function(resp) {
            expect(resp.body.word).to.equal('apple');
          })
          .end(done);
      });

      it('should find a word by any query', function(done) {
        request(app)
          .get('/api/words?word_index=0')
          .expect(200)
          .end(done);
      });

      it('should not find words that do not exist', function(done) {
        request(app)
          .get('/api/words?word=fakestreet')
          .expect(404)
          .end(done);
      });

      it('should only find one word', function(done) {
        request(app)
          .get('/api/words?language=english')
          .expect(function(result) {
            expect(result.body).to.be.a('object');
          })
          .end(done);
      });
    });

    describe('/api/words/index', function() {
      var cookie;

      it('should find the next word', function(done) {
        request(app)
          .get('/api/words/index?word_index=0')
          .expect(function(resp) {
            expect(resp.body.word_index).to.equal(1);
          })
          .end(done);
      });

      it('should restart at the first word', function(done) {
        request(app)
          .get('/api/words/index?word_index=1')
          .expect(function(resp) {
            expect(resp.body.word_index).to.equal(0);
          })
          .end(done);
      });

      it('should get a cookie with word_index incremented by one', function(done) {
        var req = request(app).get('/api/words/index?word_index=0');

        req.cookies = 'word_index=0';

        req.expect(function(resp) {
            //console.log(resp.headers);
            expect(resp.headers['set-cookies']).to.not.equal(null);
            var cookie = resp.headers['set-cookie'].pop().split(';')[0];
            expect(cookie).to.equal('word_index=1');
          })
          .end(done);
      });

      it('should reset cookie to 0 when restarting at first word', function(done) {
        var req = request(app).get('/api/words/index?word_index=1');

        req.cookies = 'word_index=1';

        req.expect(function(resp) {
            //console.log(resp.headers);
            expect(resp.headers['set-cookies']).to.not.equal(null);
            var cookie = resp.headers['set-cookie'].pop().split(';')[0];
            expect(cookie).to.equal('word_index=0');
          })
          .end(done);
      });

      it('should not find words that do not exist', function(done) {
        request(app)
          .get('/api/words/index?word_index=0&language=piglatin')
          .expect(404)
          .end(done);
      });

      it('should reject requests without word_index query', function(done) {
        request(app)
          .get('/api/words/index?language=english')
          .expect(400)
          .end(done);
      });

    });

    describe('Audio API', function() {

      describe('api/audio/:filename', function() {

        // Makes live calls to S3!
        xit('should stream a file from s3', function(done) {
          request(app)
            .get('/api/audio/apple.wav')
            .expect(function(resp) {
              expect(resp.status).to.equal(200);
              expect(resp.header['content-type']).to.equal('audio/x-wav');
            })
            .end(done);
        });

        // Makes live calls to S3!
        xit('should not stream a file that does not exist', function(done) {
          request(app)
            .get('/api/audio/fakestreet.wav')
            .expect(404)
            .end(done);
        });

      });

    });

  });


});
