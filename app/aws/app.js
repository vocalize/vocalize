var express = require('express');
var fs = require('fs');
var ejs = require('ejs');
var path = require('path');

var aws = require('./aws');


var app = express();


app.get('/words/:filename', aws.downloadStream);

app.listen(8000);
