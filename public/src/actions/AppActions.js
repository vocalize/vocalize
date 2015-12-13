import * as types from '../constants/AppActionTypes';
import fetch from 'isomorphic-fetch';

function requestNewWord(word){
  return {
    type: REQUEST_NEW_WORD,
    word
  }
}

function receiveNewWord(word, json){
  return {
    type: RECEIVE_NEW_WORD,
    word,

  }
}

function sendNewWord(word) {
  
}

function playNewWord(word){
  return dispatch => {
    dispatch()
  }
}