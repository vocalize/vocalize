import * as types from '../constants/ActionTypes';


function playWord(word){//x
  return {
    type: types.PLAY_WORD,
    data: word, //send a boolean to the audio reducers
  }
}
//checkout the sounds redux native functions for an example

function recordUserAudio(word, play){//x
  return {
    type: types.RECORD_USER_AUDIO,
    word,
    play,
  }
}

function stopUserRecording(word, record){//x
  return {
    type: types.STOP_RECORDING_USER_AUDIO,
    word,
    record,
  }
}
function stopPlaying(playing, stop){
  return {
    type: types.STOP_PLAYING,
    playing,
    stop,

  }
}

function sendUserRecording(finished){//x
  return {
    type: types.SEND_RECORDING_USER_AUDIO,
    finished,
  }
}

function doneRecoring(done){
  return {
    type: types.FINISED_RECORDING,
    done,
  }
}


export function play(){
  if(this.state.recording){
    AudioRecorder.stopRecording();
    dispatch(recordUserAudio(false));
  }
  AudioRecorder.playRecording();
  dispatch(playWord(true));
}

export function stopping(){
  if (this.state.recording) {
      AudioRecorder.stopRecording();
      dispatch(stopUserRecording(true, false))
    } else if (this.state.playing) {
      AudioRecorder.stopPlaying();
      dispatch(stopPlaying(false, true));
    }
}

export function record(){
  AudioRecorder.startRecording();
  dispatch(recordUserAudio(true, false))
}

















