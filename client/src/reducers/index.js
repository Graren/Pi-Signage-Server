import { reducer as formReducer } from 'redux-form'

import home from './home'
import user from './user'

export default {
  form: formReducer,
  home,
  user
}
