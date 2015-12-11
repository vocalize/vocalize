var aws = require('./aws');
var fs = require('fs');
var path = require('path');

var flags = process.argv.slice(2);

switch(flags[0]){

	// Upload a file to Amazon s3
	// node index.js upload <filename>
	// Does not save db
	// File assumed to be in the same directory
	case 'upload':
		aws.uploadFile(flags[1]);
		break;

	// Save word to DB and upload to S3
	// node index.js save <json file>
	// Requires a JSON file with:
	// // file:   <audio filepath to upload>
	// // Params: <object with language, gender etc.>
	// wordlist.json as an example
	// File assumed to be in the same directory
	case 'save':
		fs.readFile(path.join(__dirname, flags[1]), function(err, data){
			if(err){
				console.log('Error reading ' + flags[1]);
			} else {
				var content = JSON.parse(data);
				aws.addWord(content.file, content.params)
				.then(console.log.bind(this, 'Added word', content.word));
			}
		});
		break;

	// Add directory of audio files to s3 and DB
	// Assumes params.json file is present with language, accent and gender info
	// Sets the word as the filename
	// node index.js addDir testwords
	case 'addDir':
		aws.addWordsByDir(path.join(__dirname, flags[1]));
		break;

	// Removes all words matching query from s3 and DB
	// Query needs to be an object
	// node index.js remove {} - will get rid of everything!
	case 'remove':
		aws.removeWordsByQuery(flags[1]);
		break;
}
