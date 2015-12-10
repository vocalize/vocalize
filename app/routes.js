var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();

var helpers = require('./request-handler');

// MIDDLEWARE
router.use(bodyParser.json()); // automatically parses the body of all POST requests
router.use(bodyParser.urlencoded({extended: true})); // only accept url encoded requests


// ROUTES
router.get('/api/next', helpers.retrieveNextWord);

router.post('/api/audio', function(req, res) {
  res.json('hello world');
});

module.exports = router;
