import * as types from './action_constants';
import axios from 'axios';
import { pushState } from 'redux-react-router';



export function setState(state){//x
  return {
    type: types.SET_STATE,
    data: state
  }
}


function playWord(word){//x
  return {
    type: types.PLAY_WORD,
    data: word,
  }
}

function recordUserAudio(word){//x
  return {
    type: types.RECORD_USER_AUDIO,
    word,
  }
}

function stopUserRecording(word){//x
  return {
    type: types.STOP_RECORDING_USER_AUDIO,
    word,
  }
}

function sendUserRecording(word){//x
  return {
    type: types.SEND_RECORDING_USER_AUDIO,
    word,
  }
}

function receiveNewWord(json) {
  return{
    type: types.RECEIVE_NEW_WORD,
    data: json
  }
};


function requestNextWord(word){ //x
  return {
    type: types.REQUEST_NEXT_WORD,
    data: word,
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

export function setInitalState(){
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
        dispatch(setState(response.data));
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


export function postWord(){
  return function(dispatch){
    return axios.({
      method: 'post',
      url: '/api/word/',
      data: {'word': this.state.targetWord},
    })
      .then(function(response){
        dispatch(sendUserRecording(response.data))
      })
  }
}

export function record(){
startRecordingUserAudio: function() {
    this.recordRTC.startRecording();
  } // this will need to be changed to update the state of the function only
  return function(dispatch){
    disptach(recordUserAudio()) 
  }
}




























