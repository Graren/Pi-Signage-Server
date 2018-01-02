import { reducer as formReducer } from 'redux-form'
import { routerReducer } from 'react-router-redux'
import home from './home'
import user from './user'

export default {
  form: formReducer,
  router: routerReducer,
  home,
  user
}
