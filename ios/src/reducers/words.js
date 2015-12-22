import * as types from '../constants/ActionTypes';

const initalState = {
  language: 'english',
  gender: 'male',
  targetWord: null,
  percentCorrect: null,
}

export default function words( state = initalState, action){
  switch(action.types) {
//can't have the type be null it needs to be passed in from the action functions
  case SET_STATE: 
    return Object.assign({}, state, {
      language: 'english',
      gender: 'male',
      targetWord: action.data.word,
      percentCorrect: null,
    })

  case types.REQUEST_NEXT_WORD:
    return Object.assign({}, state, {
      targetWord: action.data.word,
    });

  case types.RECEIVE_NEW_WORD: 
    return Object.assign({}, state, {//this probably needs to get fixed
      percentCorrect: action.data
    })
  case types.GET_SCORE:
    return Object.assign({}, state, {
      percentCorrect: action.score
    })
  default: 
    return state;
  }
}



