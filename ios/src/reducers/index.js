import {combineReducers} from 'redux'
import audio from '../reducers/audio'
import words from '../reducers/words'

const rootReducer = combineReducers({
  audio,
  words
})

export default rootReducer
