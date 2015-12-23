var ffprobe = require('fluent-ffmpeg').ffprobe;

var file = process.argv[2];

ffprobe(file, function(err, metadata){
	if(err){
		process.stderr.write(err);
	} else {
		process.stdout.write(JSON.stringify(metadata));
	}
});