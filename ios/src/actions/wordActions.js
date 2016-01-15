import * as types from '../constants/ActionTypes';
import CookieManager 'react-native-cookies';
//this needs to be polished
export function setState(state){
  return {
    type: types.SET_STATE,
    data: state
  } 
}

export function receiveNewWord(json) {
  return{
    type: types.RECEIVE_NEW_WORD,
    data: json
  }
};

export function getScore(json) {
  return{
    type: types.GET_SCORE,
    data: json
  }
};

export function getPreviousWord(word){
  return {
    type: types.LOAD_PREVIOUS_WORD,
    data: word,
  }
}

export function requestNextWord(word){
  return {
    type: types.REQUEST_NEXT_WORD,
    data: word,
  }
}
export function getS3Key(key){
  return {
    type: types.GET_S3_KEY,
    data: key,
  }
}
export function loading(loading){
  return {
    type: types.LOADING,
    laoding,
  }
}

export function instrctions(instrctions){
  return {
    type: types.INSTRUCTIONS,
    instrctions,
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



export function loadPrevWord() {
    const url = this.generatePrevWordUrl();
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          currentWord: data.word, 
          s3key: data.s3.Key
        });
      })
      .then(function(currentWord) {
        dispatch(getPreviousWord(percentCorrect))
      })
      .then(function(s3key) {
        dispatch(getS3Key(percentCorrect))
      })
      .catch((error) => {
        console.warn(error);
      });
  }

  export function loadNextWord() {
    const url = this.generateNextWordUrl();
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          currentWord: data.word, 
          s3key: data.s3.Key
        });
        this.updateCurrentWordCookie();
      })
      .then(function(currentWord) {
        dispatch(requestNextWord(percentCorrect))
      })
      .then(function(s3key) {
        dispatch(getS3Key(percentCorrect))
      })
      .catch((error) => {
        console.warn(error);
      });
  }

  export function generateNextWordUrl() {
    const language = 'language=' + this.state.language.toLowerCase();
    const gender = 'gender=' + this.state.gender.toLowerCase();
    const ip = 'https://vocalizeapp.com';
    const url = ip + '/api/words/index/?' + language + '&' + gender;
    return url;
  }
  
  export function generatePrevWordUrl() {
    const language = 'language=' + this.state.language.toLowerCase();
    const gender = 'gender=' + this.state.gender.toLowerCase();
    const ip = 'https://vocalizeapp.com';
    const url = ip + '/api/words/previndex/?' + language + '&' + gender;
    return url;
  }

  export function updateCurrentWordCookie() {
    // set cookie that expires in 30 days
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    if (month === 11) {
      month = 1;
      year += 1;
    } else {
      month += 1;
    }
    const day = date.getDate();
    const time = 'T12:30:00.00-05:00'
    const expiration = '' + year + '-' + month + '-' + day + time;
    const currentWord = this.state.currentWord;

    const currentWordCookie = {
      name: 'word',
      value: currentWord,
      domain: '127.0.0.1',
      origin: '/',
      path: '/',
      version: '1',
      expiration: expiration,
    };
    
    CookieManager.set(currentWordCookie, (err, res) => {
      if (err) {
        console.log(err);
      }
    });
  }

  export function updateWordIndexCookie(wordIndex) {
    // set cookie that expires in 30 days
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    if (month === 11) {
      month = 1;
      year += 1;
    } else {
      month += 1;
    }
    const day = date.getDate();
    const time = 'T12:30:00.00-05:00'
    const expiration = '' + year + '-' + month + '-' + day + time;
    const currentWord = this.props.currentWord;

    const currentWordCookie = {
      name: 'word_index',
      value: wordIndex,
      domain: '127.0.0.1',
      origin: '/',
      path: '/',
      version: '1',
      expiration: expiration,

    };
    
    CookieManager.set(currentWordCookie, function(err, res) {
      if (err) {
        console.log(err);
      }
    });
  }

 export function toggleLoading() {
    this.setState({
      loading: !this.state.loading,
      instructionsDisplayed: false
    });
    dispatch()
  }

export function onComparisonResults(score) {
    this.setState({
      comparisonResults: score
    });
    dispatch(getScore(comparisonResults));
  },

export function resetComparisonResults() {
    this.setState({
      comparisonResults: 0
    });
    dispatch(getScore(comparisonResults));
  },


  


