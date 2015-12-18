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
  
}



export function play(){
 AudioPlayer.playWithUrl()
}


export function postWord(){
  
}

export function record(){


}






























