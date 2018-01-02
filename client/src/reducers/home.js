import { success, error } from 'redux-saga-requests'
import {
  SWITCH_TO_LOGIN,
  SWITCH_TO_SIGNUP,
  LOGIN,
  SIGNUP
} from '../actions/home'

const defaultState = {
  authMode: 'login',
  login: {},
  signup: {}
}

const homeReducer = (state = defaultState, action) => {
  switch (action.type) {
    case SWITCH_TO_LOGIN:
      return {
        ...state,
        authMode: 'login'
      }
    case SWITCH_TO_SIGNUP:
      return {
        ...state,
        authMode: 'signup'
      }
    case error(LOGIN): {
      const { payload: { error: { response } } } = action
      return {
        ...state,
        login: {
          ...state.login,
          error: response || true
        }
      }
    }
    case success(LOGIN):
      return {
        ...state,
        login: {}
      }
    case error(SIGNUP): {
      const { payload: { error: { response } } } = action
      return {
        ...state,
        signup: {
          ...state.signup,
          error: response || true
        }
      }
    }
    case success(SIGNUP):
      return {
        ...state,
        signup: {}
      }
    default:
      return state
  }
}

export default homeReducer
