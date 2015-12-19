var fs = require('fs');

module.exports = {
  handleError: function(err) {
    console.error(err);
  },

  exists:  function(path) {
    try {
      return fs.statSync(path).isFile() || fs.statSync(path).isDirectory();
    } catch (err) {
      return false;
    }
  },

};