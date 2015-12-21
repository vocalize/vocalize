export function getWordUrl(){
  return `http://d2oh9tgz5bro4i.cloudfront.net/${word}`
}

function loadAudio(){
  var url = getWordUrl();
  AudioRecorder.prepareRecordingAtUrl(url)
}


