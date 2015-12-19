var fs = require('fs');

var rmdirRf = function(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function(file, index) {
      var curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        rmdirRf(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

var exists = function(path) {
    try {
      return fs.statSync(path).isFile() || fs.statSync(path).isDirectory();
    } catch (err) {
      return false;
    }
  }

module.exports = {
	rmdirRf: rmdirRf,
  exists: exists
};
