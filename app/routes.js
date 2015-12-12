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
router.use(bodyParser.urlencoded({extended: true})); // only accept url encoded requests

// ROUTES
/**
 * Get Single Word by Query String
 */
router.get('/api/words/', wordController.getWord);

/**
 * Get next word by index
 * Must satisfy other query parameters: language etc.
 */
router.get('/api/words/index/', wordController.getWordByNextIndex);

/**
 * Stream file from S3 to response
 * Include S3 filename as a parameter
 */
router.get('/api/audio/:filename', aws.downloadStream);

/**
* Compare the user audio to archetype audio 
* curl -X POST -H "Content-Type: audio/wav" --data-binary @"some/audio/file.wav" http://localhost:3000/api/audio
**/
router.post('/api/audio/', wordController.compareAudio);

/**
* Post the text version of the user audio
* To be used in the lookup of the archetype audio
**/
// router.post('/api/word/', function(req, res) {
//   var word = req.body.word;
//   console.log(req.body);
//   res.json('ok')
// });

router.post('/api/word/', wordController.setWord);

module.exports = router;