var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();

var aws = require('./aws/aws');
var helpers = require('./request-handler');

// MIDDLEWARE
router.use(bodyParser.json()); // automatically parses the body of all POST requests
router.use(bodyParser.urlencoded({extended: true})); // only accept url encoded requests

// ROUTES
router.get('/api/next', helpers.retrieveNextWord);

router.get('/api/audio/:filename', aws.downloadStream);

module.exports = router;
