var path = require('path');

module.exports = {
	username: ADD_CREDS,
	password: ADD_CREDS,
	inputDir:  path.join(__dirname, '..', '..', 'input'),
	outputDir: path.join(__dirname, '..', '..', 'output'),
	wordListDir: path.join(__dirname, '..', '..', 'word-lists'),
	audioChunkLength: 300
};