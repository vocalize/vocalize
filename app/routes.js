var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var router = express.Router();
router.use(cookieParser());

var aws = require('./aws/aws');
var wordController = require('./controllers/words');

// MIDDLEWARE

router.use(bodyParser.raw({ type: 'audio/wav', limit: '50mb' }));
router.use(bodyParser.json()); // automatically parses the body of all POST requests
//router.use(bodyParser.urlencoded({extended: true})); // only accept url encoded requests

// ROUTES
/**
 * Get Single Word by Query String
 */
router.get('/api/word/', wordController.getWord);

/**
 * Get next word by index
 * Must satisfy other query parameters: language etc.
 */
router.get('/api/word/index/', wordController.getWordByNextIndex);

/**
 * Stream file from S3 to response
 * Include S3 filename as a parameter
 */
router.get('/api/audio/:filename', aws.downloadStream);

// curl -X POST -H "Content-Type: audio/wav" --data-binary @"some/audio/file.wav" http://localhost:3000/api/audio
router.post('/api/audio/', function(req,res) {
  // TODO: audio comparative analysis
  var audioFile = req.body;
  console.log(audioFile);
  res.json('ok');
});

router.post('/api/word/', function(req, res) {
  var word = req.body.word;
  console.log(req.body);
  res.json('ok')
});

module.exports = router;