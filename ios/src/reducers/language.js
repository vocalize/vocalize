 const initalState = {
  showRowIconEnglish: true,
  showRowIconSpanish: false
 }

 export default function reducer(state = initalState, action){
  switch(action.types){
    case types.ENGLISH:
      return Object.assign({}, state, {
      showRowIconEnglish: action.language,
      showRowIconSpanish: action.language
    });
    default: 
     return state;
  }
 }