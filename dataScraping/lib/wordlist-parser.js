var fs = require('fs');
var path = require('path');
var Promise = require('bluebird');
var util = require('./util');
var config = require('./config/config');

var wordLists = {
  english: 'eng-1000mostcommon.json'
};


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

  getWordList: function(language, syllables) {

    if (wordLists[language]) {

      syllables = syllables || 1;
      var jsonFile = path.join(config.wordListDir, wordLists[language]);
      var data = JSON.parse(fs.readFileSync(jsonFile));
      for (var word in data) {
        if (util.countSyllables(word) < syllables) {
          delete data[word];
        }
      }
      return data;
    } else {
      return false;
    }

  }


};
