export const GET_MY_SCREENS = 'GET_MY_SCREENS'
export const GET_SCREEN_BY_ID = 'GET_SCREEN_BY_ID'

export const getMyScreens = () => {
  return {
    type: GET_MY_SCREENS,
    authRequest: { url: '/api/v1/dispositivo/' }
  }
}

export const getScreenById = id => {
  return {
    type: GET_SCREEN_BY_ID,
    authRequest: { url: `/api/v1/dispositivo/${id}/` }
  }
}
