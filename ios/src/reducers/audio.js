import * as types from '../constants/ActionTypes';

const initalState = {
  recording: false,
  stoppedRecording: false,
  stoppedPlaying: false,
  playing: false,
  finished: false
}


export default function audio( state = initalState, action){

  switch(action.types) {
//change the booleans to get passed in by the action functions
  case types.PLAY_WORD:
    return Object.assign({}, state, {
      playing: action.word
    });
  case types.STOP_PLAYING:
    return Object.assign({}, state, {
      playing: action.playing,
      stoppedPlaying: action.stop
    });
  case types.RECORD_USER_AUDIO:
    return Object.assign({}, state, {
      recording: action.word,
      playing: action.play
    });
  case types.STOP_RECORDING_USER_AUDIO:
    return Object.assign({}, state, {
      stoppedRecording: action.word
      recording: action.record
    });
  case types.SEND_RECORDING_USER_AUDIO:
    return Object.assign({}, state, {
      finished: action.finished
    })
  default: 
    return state;
  }
}