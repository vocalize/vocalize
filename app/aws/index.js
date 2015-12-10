var aws = require('./aws');

var flags = process.argv.slice(2);

switch(flags[0]){

	// Upload a file to Amazon s3
	// node index.js upload <filename>
	// File assumed to be in the same directory
	case 'upload':
		aws.uploadFile(flags[1]);
		break;
}