export const SET_USER_TOKEN = 'SET_USER_TOKEN'
export const REMOVE_USER_DATA = 'REMOVE_USER_DATA'
export const GET_MY_USER = 'GET_MY_USER'

export const getMyUser = () => {
  return {
    type: GET_MY_USER,
    authRequest: { url: '/api/v1/user/me' }
  }
}

export const setUserToken = token => {
  return {
    type: SET_USER_TOKEN,
    token
  }
}

export const removeUserData = () => {
  return {
    type: REMOVE_USER_DATA
  }
}
