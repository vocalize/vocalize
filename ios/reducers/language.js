import {combineReducers} from 'redux'
import audio from '../reducers/audio'
import words from '../reducers/words'
import audio from '../reducers/home'
import words from '../reducers/language'

const rootReducer = combineReducers({
  audio,
  words,
  home,
  language
})

export default rootReducer
