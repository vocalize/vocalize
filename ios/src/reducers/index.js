import {combineReducers} from 'redux'
import audio from '../reducers/audio'
import words from '../reducers/words'
import home from '../reducers/home'
import language from '../reducers/language'
import selection from '../reducers/selections'

const rootReducer = combineReducers({
  audio,
  words,
  home,
  language,
  selection
})

export default rootReducer
