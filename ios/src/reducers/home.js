 const initalState = {
  gender: this.props.gender,
  language: this.props.language,
  currentWord: ' ',
  s3key: '',
  instructionsDisplayed: true,
  comparisonResults: -1,
  loading: false
 }

 export default function home(state = initalState, action){
  switch(action.types){
    case types.LOAD_PREVIOUS_WORD:
      return Object.assign({}, state, {
      currentWord: action.word
    });
    case types.REQUEST_NEXT_WORD:
      return Object.assign({}, state, {
      currentWord: action.word
    });
    case types.GET_SCORE:
      return Object.assign({}, state, {
      comparisonResults: action.word
    });
    case types.GET_S3_KEY :
      return Object.assign({}, state, {
      s3key: action.key
    });
    case types.LOADING :
      return Object.assign({}, state, {
      loading: action.laoding
    });
    case types.INSTRUCTIONS :
      return Object.assign({}, state, {
      intructions: action.indstructions
    });
    default: 
     return state;
  }
 } 