var path = require('path');

module.exports = {
	aws : path.join(__dirname, 'testfiles', 'aws'),
	audioParser: path.join(__dirname, 'testfiles', 'audio-parser'),
	standardiseWordLength: path.join(__dirname, 'testfiles', 'standardise-word-length'),
	transcriptParser: path.join(__dirname, 'testfiles', 'transcript-parser'),
	youtubeScraper: path.join(__dirname, 'testfiles', 'youtube-scraper')
}