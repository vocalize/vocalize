var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();

var aws = require('./aws/aws');
var helpers = require('./request-handler');
var wordController = require('./controllers/words');

// MIDDLEWARE
router.use(bodyParser.json()); // automatically parses the body of all POST requests
router.use(bodyParser.urlencoded({extended: true})); // only accept url encoded requests

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

router.post('/api/audio', function(req,res) {
  // TODO: audio comparative analysis
});

module.exports = router;
