var path = require('path');
var express = require('express');
var cookieParser = require('cookie-parser');

var routes = require('./app/routes');
var db = require('./app/config');

var app = express();
app.use(cookieParser());


app.set('port', (process.env.PORT || 3000));

// Set cookie if none exists
app.use(function(req, res, next) {
  var cookie = req.cookies.word_index;
  if ( !cookie ) {
  	res.cookie("word_index" , 0);
  }
  next();
});

// Client Route - serve up all files in the public directory on requests to the home page
app.use('/', express.static(path.join(__dirname, 'public')));


// Routing
app.use('/', routes);

// Start Server
app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});

module.exports = app;