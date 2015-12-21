import * as types from '../constants/ActionTypes';

export function setState(state){
  return {
    type: types.SET_STATE,
    data: state
  }
}

function receiveNewWord(json) {
  return{
    type: types.RECEIVE_NEW_WORD,
    data: json
  }
};

function getScore(json) {
  return{
    type: types.GET_SCORE,
    data: json
  }
};


function requestNextWord(word){
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

export function receiveScore(soundBlob){
  let formData = new FormData();
  formData.append('userAudio', soundBlob);
  AudioRecorder.onFinished = (data) => {
    return function(dispatch) {
    return axios.({
      method: 'post',
      url: '/api/audio/',
      data: formData,
      processData: false,
      contentType: 'audio/wav',
    })
      .then(function(data) {
        let percentCorrect = Math.floor(data);
        dispatch(getScore(percentCorrect)
      })
  }
}
}




