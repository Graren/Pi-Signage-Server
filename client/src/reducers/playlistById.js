import { requestsReducer } from 'redux-saga-requests'
import { GET_PLAYLIST_BY_ID } from '../actions/playlists'

const playlistByIdReducer = requestsReducer({ actionType: GET_PLAYLIST_BY_ID })

export default playlistByIdReducer
