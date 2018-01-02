import { success } from 'redux-saga-requests'
import { REMOVE_USER_DATA, SET_USER_TOKEN, GET_MY_USER } from '../actions/user'

const initialState = {
  id: null,
  name: null,
  email: null,
  token: null
}

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case success(GET_MY_USER): {
      const { payload: { data } } = action
      return {
        ...state,
        ...data
      }
    }
    case SET_USER_TOKEN:
      return {
        ...state,
        token: action.token
      }
    case REMOVE_USER_DATA:
      return initialState
    default:
      return state
  }
}

export default userReducer
