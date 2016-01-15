 const initalState = {
  showRowIconEnglish: true,
  showRowIconSpanish: false
 }

 export default function reducer(state = initalState, action){
  switch(action.types){
    case types.CHOOSE_ENGLISH:
      return Object.assign({}, state, {
      showRowIconEnglish: action.english,
      showRowIconSpanish: action.spanish
    });
    case types.CHOOSE_SPANISH:
      return Object.assign({}, state, {
      showRowIconEnglish: action.english,
      showRowIconSpanish: action.spanish
    });
    default: 
     return state;
  }
 }