var ffmpeg = require('fluent-ffmpeg');

var args = {
  inputPath: process.argv[2],
  outputPath: process.argv[3],
  startTime: process.argv[4],
  duration: process.argv[5],
  audioCodec: process.argv[6]
};

process.stdout.write(args.outputPath);

var command = ffmpeg(args.inputPath);

  if(args.audioCodec){
    command.audioCodec(args.audioCodec);
  }

  command
  // Time to begin parsing
  .setStartTime(args.startTime)
  // Duration of snippet
  // Add a buffer so audio file doesn't get cut off too early
  .setDuration(args.duration)
  // set the number of channels
  .audioChannels(1)
  // Output file location
  .output(args.outputPath)
  //Failure
  .on('error', function(err) {
    process.stderr.write('Error ' + err);
  })
  //Run ffmpeg command
  .run();
