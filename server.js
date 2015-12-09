var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');

var routes = require('./app/routes');
var db = require('./app/config');

var app = express();


app.set('port', (process.env.PORT || 3000));

// Client Route
// repsonde with all files in the public directory on requests to the home page
app.use('/', express.static(path.join(__dirname, 'public')));


// Routing
app.use('/api', routes);

// Start Server
app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});

module.exports = app;