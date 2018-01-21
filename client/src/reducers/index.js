import { reducer as formReducer } from 'redux-form'
import { routerReducer } from 'react-router-redux'
import home from './home'
import user from './user'
import navbar from './navbar'
import playlists from './playlists'
import playlistById from './playlistById'
import groups from './groups'
import groupById from './groupById'
import screens from './screens'
import screenById from './screenById'
import userStats from './userStats'

export default {
  form: formReducer,
  router: routerReducer,
  home,
  user,
  navbar,
  playlists,
  playlistById,
  groups,
  groupById,
  screens,
  screenById,
  userStats
}
