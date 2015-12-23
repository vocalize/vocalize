process.env.NODE_ENV = 'test';

var fs = require('fs');
var request = require('supertest');
var express = require('express');
var mongoose = require('mongoose');
var expect = require('chai').expect;
var sinon = require('sinon');
var db = require('../../app/config');
var app = require('../../server');

var Word = require('../../app/models/word');
var Counter = require('../../app/models/counter');

var cookieParser = function(cookie) {
  return cookie.reduce(function(obj, cookie) {
    var keyValue = cookie.split(';')[0].split('=');
    obj[keyValue[0]] = keyValue[1];
    return obj;
  }, {});
};

describe('Routes', function() {

  var con;

  before(function(done) {
    con = mongoose.createConnection('mongodb://localhost/vocalizetest');

    Word.remove({})
      .then(function() {
        return Counter.remove({});
      })
      .then(function() {
        return Word.create({
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
        return Word.create({
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
        return Word.create({
          word: 'board',
          language: 'english',
          accent: 'general',
          gender: 'male',
          s3: {
            Bucket: 'hr10-vocalize-testing',
            Key: 'board.wav'
          }
        });
      })
      .then(function() {
        return Word.create({
          word: 'circle',
          language: 'english',
          accent: 'general',
          gender: 'female',
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
      mongoose.connection.close();
      con.close(done);
    });

  });

  it('should load the index', function(done) {
    request(app)
      .get('/')
      .expect(200)
      .end(done);
  });

  it('should have three words on the db', function(done) {
    Word.find({})
      .then(function(words) {
        expect(words.length).to.equal(4);
        done();
      });
  });

  describe('Word Model', function() {

    it('should accept multiple words with the same word index', function(done) {
      Word.find({
          word_index: 0
        })
        .then(function(words) {
          expect(words.length).to.equal(2);
          done();
        });
    });

    it('should increment the counter for words of the same type', function(done) {
      Word.find({
          gender: 'male'
        })
        .then(function(words) {
          expect(words.length).to.equal(3);
          expect(words[0].word_index).to.not.equal(words[1].word_index);
          done();
        });
    });

    it('should not add the same word object twice', function(done) {
      Word.create({
          word: 'apple',
          language: 'english',
          accent: 'general',
          gender: 'male',
          s3: {
            Bucket: 'hr10-vocalize-testing',
            Key: 'apple.wav'
          }
        })
        .catch(function(err) {
          done();
        });
    });

  });

  describe('Counter Model', function() {

    it('should create a new counter for each type of word', function(done) {
      Counter.find()
        .then(function(counters) {
          expect(counters.length).to.equal(2);
          expect(counters[0].language).to.equal(counters[1].language);
          expect(counters[0].gender).to.not.equal(counters[1].gender);
          done();
        });
    });

    // Still counts up for the word that wasn't added
    it('should increment counter for each word added', function(done) {
      Counter.findOne({
          'gender': 'male'
        })
        .then(function(counter) {
          expect(counter.seq).to.equal(4);
          done();
        });
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
          .get('/api/words?word_index=0&gender=female')
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
        var req = request(app).get('/api/words/index?language=english&accent=general&gender=male');

        req.cookies = 'word_index=0';

        req.expect(function(resp) {
            expect(resp.status).to.equal(200);
            expect(resp.body.word_index).to.equal(1);
          })
          .end(done);
      });


      it('should optionally find the previous word', function(done) {
        var req = request(app).get('/api/words/index?previous=true&language=english&accent=general&gender=male');

        req.cookies = 'word_index=1';

        req.expect(function(resp) {
            expect(resp.status).to.equal(200);
            expect(resp.body.word_index).to.equal(0);
          })
          .end(done);
      });

      it('should find words by index and query', function(done) {
        var req = request(app).get('/api/words/index?language=english&accent=general&gender=female');

        req.cookies = 'word_index=0';

        req.expect(function(resp) {
            expect(resp.status).to.equal(200);
            expect(resp.body.word_index).to.equal(0);
            expect(resp.body.gender).to.equal('female');
          })
          .end(done);
      });

      it('should restart at the first word', function(done) {
        var req = request(app).get('/api/words/index?language=english&gender=male');

        req.cookies = 'word_index=2';

        req.expect(function(resp) {
            expect(resp.status).to.equal(200);
            expect(resp.body.word_index).to.equal(0);
          })
          .end(done);
      });

      it('should get a cookie with word_index incremented by one', function(done) {
        var req = request(app).get('/api/words/index?language=english&gender=male');

        req.cookies = 'word_index=0';

        req.expect(function(resp) {
            expect(resp.status).to.equal(200);
            expect(resp.headers['set-cookies']).to.not.equal(null);
            var cookie = cookieParser(resp.headers['set-cookie']);
            expect(cookie.word_index).to.equal('1');
          })
          .end(done);
      });

      it('should reset cookie to 0 when restarting at first word', function(done) {
        var req = request(app).get('/api/words/index?language=english&gender=male');

        req.cookies = 'word_index=2';

        req.expect(function(resp) {
            expect(resp.status).to.equal(200);
            expect(resp.headers['set-cookie']).to.not.equal(undefined);
            var cookie = cookieParser(resp.headers['set-cookie']);
            expect(cookie.word_index).to.equal('0');
          })
          .end(done);
      });

      it('should handle word indexes that do not exist', function(done) {
        var req = request(app).get('/api/words/index?language=english&gender=male');

        req.cookies = 'word_index=5000';

        req.expect(function(resp) {
            expect(resp.status).to.equal(200);
            expect(resp.headers['set-cookie']).to.not.equal(undefined);
            var cookie = cookieParser(resp.headers['set-cookie']);
            expect(cookie.word_index).to.equal('0');
          })
          .end(done);
      });

      it('should not find words that do not exist', function(done) {
        var req = request(app).get('/api/words/index?language=piglatin&gender=martian');

        req.cookies = 'word_index=1';

        request(app)
          .get('/api/words/index?word_index=0&language=piglatin')
          .expect(404)
          .end(done);
      });

      it('should assign a response cookie even if there is no request cookie set', function(done) {
        request(app)
          .get('/api/words/index?language=english&gender=male')
          .expect(function(resp) {
            expect(resp.status).to.equal(200);
            expect(resp.headers['set-cookie']).to.not.equal(undefined);
            var cookie = cookieParser(resp.headers['set-cookie']);
            expect(cookie.word_index).to.equal('0');
          })
          .end(done);
      });
    });


  });

});
