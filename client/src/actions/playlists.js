export const GET_MY_PLAYLISTS = 'GET_MY_PLAYLISTS'
export const GET_PLAYLIST_BY_ID = 'GET_PLAYLIST_BY_ID'

export const getMyPlaylists = () => {
  return {
    type: GET_MY_PLAYLISTS,
    authRequest: { url: '/api/v1/list/' }
  }
}

export const getPlaylistById = id => {
  return {
    type: GET_PLAYLIST_BY_ID,
    authRequest: { url: `/api/v1/list/${id}` }
  }
}
