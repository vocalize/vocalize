var fs = require('fs');
var path = require('path');
var Promise = require('bluebird');
var util = require('./util');
var config = require('./config/config');

module.exports = {

  textToJson: function(filename) {
    return new Promise(function(resolve, reject) {

      var textFile = path.join(config.wordListDir, filename);
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

        fs.writeFile(path.join(config.wordListDir, fileName + '.json'), json, function(err) {
          if (err) {
            util.handleError(err);
          } else {
            resolve();
          }
        });
      });
    });
  },

  getWordList: function(listTitle, syllables) {
    syllables = syllables || 2;
    var jsonFile = path.join(config.wordListDir, listTitle + '.json');
    var data = JSON.parse(fs.readFileSync(jsonFile));
    for (var word in data) {
      if (util.countSyllables(word) < syllables) {
        delete data[word];
      }
    }
    return data;
  }
};
