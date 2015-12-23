var ffmpeg = require('fluent-ffmpeg');
var path = require('path');

var args = {
	inputFile: process.argv[2],
	outputFile: process.argv[3],
	tempo: process.argv[4]
};

ffmpeg(args.inputFile)
  .audioCodec('pcm_f32le')
  .audioFilters('atempo=' + args.tempo)
  .output(args.outputFile)
  .on('error', function(err) {
    process.stderr.write(err);
  })
  .on('end', function(){
  	process.stdout.write('Standardised ' + path.parse(args.inputFile).name);
  })
  .run();
