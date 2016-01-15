//this needs to be fixed as well
export function selectMale(male, female){
  return {
    type: types.CHOOSE_MALE,
    male,
    female,
  }
}
export function selectFemale(male, female){
  return {
    type: types.CHOOSE_FEMALE,
    male,
    female,
  }
}
export function selectEnglish(english, spanish){
  return {
      type: types.CHOOSE_ENGLISH,
      english,
      spanish, 
    }
}
export function selectSpanish(english, spanish){
  return {
    type: types.CHOOSE_SPANISH,
    english,
    spanish, 
  }
}

export function onSelectMale() {
    let slection = this.props.onSelectGender('Male');
    this.props.navigator.pop();
    dispatch(selectMale(true, false));
  }

  export function onSelectFemale() {
    let slection = this.props.onSelectGender('Female');
    this.props.navigator.pop();
    dispatch(selectFemale(false, true));
  }

   export function onSelectEnglish() {
    let slection = this.props.onSelectGender('English');
    this.props.navigator.pop();
    dispatch(selectSpanish(true, false));
  }

  export function onSelectSpanish() {
    let slection = this.props.onSelectGender('Spanish');
    this.props.navigator.pop();
    dispatch(selectSpanish(false, true));
  }


  