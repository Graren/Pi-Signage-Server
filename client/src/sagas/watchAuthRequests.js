// @flow
import { call, put, takeEvery, select } from 'redux-saga/effects'
import { success } from 'redux-saga-requests'
import { LOGIN } from '../actions/home'
import { updateUserData } from '../actions/user'

const getActionPayload = action =>
  action.payload === undefined ? action : action.payload

export const isAuthRequestAction = action => {
  const actionPayload = getActionPayload(action)
  return actionPayload.authRequest || actionPayload.authRequests
}

export function * sendAuthRequest (action) {
  const payload = getActionPayload(action)
  const token = yield select(state => state.user.token)
  if (payload.authRequest) {
    const request = {
      ...payload.authRequest,
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    yield put({ type: action.type, request })
  } else if (payload.authRequests) {
    const requests = payload.authRequests.map(request => ({
      ...request,
      headers: {
        Authorization: `Bearer ${token}`
      }
    }))
    yield put({ type: action.type, requests })
  }
}

export default function * watchAuthRequests () {
  yield takeEvery(isAuthRequestAction, sendAuthRequest)
}
