var fs = require('fs');

/**
 * Checks if path is a valid file or directory
 * Returns boolean
 */
module.exports = {
  exists: function(path) {
  	console.log(path);
    try {
      return fs.statSync(path).isFile() || fs.statSync(path).isDirectory();
    } catch(err) {
    	return false;
    }
  },
  
  handleError: function(err){
  	console.error('Blew it! ' + err);
  }
};
