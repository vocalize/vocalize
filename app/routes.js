var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();

// Middleware

// automatically parses the body of all POST requests
router.use(bodyParser.json());
// only accept url encoded requests
router.use(bodyParser.urlencoded({extended: true}));


router.get('/', function(req, res) {
  res.json('hello world');
});

router.post('/', function(req, res) {
  res.json('hello world');
});

module.exports = router;