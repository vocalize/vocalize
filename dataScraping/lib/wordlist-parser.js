'use strict'

var fs = require('fs');
var path = require('path');
var util = require('./util');

module.exports = {

  textToJson: function(filepath) {
    var textFile = path.join(__dirname, '..', filepath);
    var fileName = path.basename(textFile, '.txt');

    fs.readFile(textFile, function(err, data) {
      if (err) {
        util.handleError(err);
      }
      var content = data.toString();

      var json = JSON.stringify(content.split('\n').reduce(function(hash, word) {
        hash[word] = true;
        return hash;
      }, {}));

      fs.writeFile(path.join(__dirname, '..', 'word-lists', fileName + '.json'), json, function(err) {
        if (err) {
          util.handleError(err);
        } else {
          console.log(fileName + ' successfully parsed');
        }
      });
    });
  },

  getWordList: function(listTitle) {
    var jsonFile = path.join(__dirname, '..', 'word-lists', listTitle + '.json');
    return JSON.parse(fs.readFileSync(jsonFile));
  }
};
