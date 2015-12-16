import * as types from './action_constants';

export function setState(state){
  return {
    type: SET_STATE,
    state
  }
}


export function playWord(word){
  return {
    type: PLAY_WORD,
    word,
  }
}

export function recordUserAudio(word){
  return {
    type: RECORD_USER_AUDIO,
    word,
  }
}

export function stopUserRecording(word){
  return {
    type: STOP_RECORDING_USER_AUDIO,
    word,
  }
}

export function requestNextWord(word){
  return {
    type: REQUEST_NEXT_WORD,
    word,
  }
}

Object.assign
