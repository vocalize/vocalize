import * as types from './action_constants';
import axios from 'axios';
import { pushState } from 'redux-react-router';

const recordRTC = null;

export function setState(state){
  return {
    type: types.SET_STATE,
    state
  }
}


export function playWord(word){
  return {
    type: types.PLAY_WORD,
    word,
  }
}

export function recordUserAudio(word){
  return {
    type: types.RECORD_USER_AUDIO,
    word,
  }
}

export function stopUserRecording(word){
  return {
    type: types.STOP_RECORDING_USER_AUDIO,
    word,
  }
}

export function receiveNewWord(json) {
  return{
    type: types.RECEIVE_NEW_WORD,
    data: json
  }
};


export function requestNextWord(word){
  return {
    type: types.REQUEST_NEXT_WORD,
    word,
  }
}

export function fetchWord(){
 const language = 'language=' + this.state.language; //firgure out about this in redux
 const gender = 'gender=' + this.state.gender;
 const url = '/api/words/index/?' + language + '&' + gender;

  return function(dispatch) {
    return axios.({
      method: 'get',
      url: url,
      responseType: 'json'
    })
      .then(function(response) {
        dispatch(requestNextWord(response.data));
      })
  }
}


export function stop(soundBlob){
  let formData = new FormData();
  return function(dispatch) {
    return axios.({
      method: 'post',
      url: '/api/audio/',
      data: formData,
      processData: false,
      contentType: 'audio/wav'
    })
      .then(function(response) {
        return function(dispatch) {
          this.recordRTC.clearRecordedData()
          let percentCorrect = Math.floor(response.data);
          dispatch(stopUserRecording(percentCorrect));
        }
      })
  }
}



export function play(){
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  let context = new AudioContext();
  let s3key = this.state.s3key;//needs to be fixed
   function loadSound(dispatch){
    return axios.({
      method: 'get',
      url: "https://localhost:3000/api/audio/" + s3key,
      responseType: 'arraybuffer'
    })
      .then(function(response){
        request.onload = function() { ///needs to be transforms to be used with the axios api
        let Data = request.response;
        process(Data);
      };
        dispatch(playWord(response.data))
      })
  }
  function process(Data) {
      let source = context.createBufferSource(); // Create Sound Source
      context.decodeAudioData(Data, function(buffer) {
        source.buffer = buffer;
        source.connect(context.destination);
        source.start(context.currentTime);
        // Close audio context when file is done
        source.onended = function(){
          context.close();
        }
      });
    }
}































