
brew install watchman
npm install -g npm@2
npm install -g rnpm
brew update && brew upgrade

npm install
rnpm link

node_modules/react-native-audio/ios/AudioRecorderManager.m
change the recordSettings variable (line 91) to: 
  NSDictionary *recordSettings = [NSDictionary dictionaryWithObjectsAndKeys:
          [NSNumber numberWithInt:AVAudioQualityHigh], AVEncoderAudioQualityKey,
          [NSNumber numberWithInt:kAudioFormatLinearPCM], AVFormatIDKey,
          [NSNumber numberWithInt:16], AVEncoderBitRateKey,
          [NSNumber numberWithInt: 1], AVNumberOfChannelsKey,
          [NSNumber numberWithFloat:44100.0], AVSampleRateKey,
          [NSNumber numberWithInt:16], AVLinearPCMBitDepthKey,
          [NSNumber numberWithBool:NO], AVLinearPCMIsBigEndianKey,
          [NSNumber numberWithBool:NO], AVLinearPCMIsFloatKey,
          nil];