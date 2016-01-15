import * as types from '../constants/ActionTypes';

const initalState = {
  if (this.props.gender === 'Male') {
      return {
        showRowIconMale: true,
        showRowIconFemale: false
      }
    } else {
      return {
        showRowIconMale: false,
        showRowIconFemale: true
      }
  }
}

export default function selection(state = initalState, action){
  switch(action.types){
    case types.CHOOSE_MALE:
      return Object.assign({}, state, {
      showRowIconMale: action.male,
      showRowIconFemale: action.female
    });
    case types.CHOOSE_FEMALE:
      return Object.assign({}, state, {
      showRowIconMale: action.male,
      showRowIconFemale: action.female
    });
    default: 
      return state;
  }
}


