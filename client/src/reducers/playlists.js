import { requestsReducer } from 'redux-saga-requests'
import { GET_MY_PLAYLISTS } from '../actions/playlists'

const playlistsReducer = requestsReducer({ actionType: GET_MY_PLAYLISTS })

export default playlistsReducer
