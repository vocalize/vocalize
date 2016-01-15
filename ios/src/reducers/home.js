 const initalState = {
  gender: this.props.gender,
  language: this.props.language,
  currentWord: ' ',
  s3key: '',
  instructionsDisplayed: true,
  comparisonResults: -1,
  loading: false
 }

 export default function reducer(state = initalState, action){
  switch(action.types){
    case types.   :
      return Object.assign({}, state, {
      playing: action.word
    });
    case types. :
      return Object.assign({}, state, {
      currentWord: action.word
    });
    case types. :
      return Object.assign({}, state, {
      currentWord: action.word
    });
    case types. :
      return Object.assign({}, state, {
      loading: action.word
    });
    default: 
     return state;
  }
 }