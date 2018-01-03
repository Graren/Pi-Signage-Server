import { reducer as formReducer } from 'redux-form'
import { routerReducer } from 'react-router-redux'
import home from './home'
import user from './user'
import navbar from './navbar'
import playlists from './playlists'
import playlistById from './playlistById'

export default {
  form: formReducer,
  router: routerReducer,
  home,
  user,
  navbar,
  playlists,
  playlistById
}
