import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'

import home from './home'
import user from './user'

const rootReducer = combineReducers({
  form: formReducer,
  home,
  user
})

export default rootReducer
