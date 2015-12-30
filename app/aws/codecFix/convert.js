var ffmpeg = require('fluent-ffmpeg');
var fs = require('fs');
var path = require('path');

var args = {
	inputFile: process.argv[2],
	outputFile: process.argv[3]
};

ffmpeg(fs.createReadStream(args.inputFile))
  .audioCodec('pcm_f32le')
  .output(args.outputFile)
  .on('error', function(err) {
    process.stderr.write(err);
  })
  .on('end', function(){
  	process.stdout.write('Converted ' + path.parse(args.inputFile).name);
  })
  .run();
