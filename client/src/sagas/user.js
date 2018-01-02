// @flow
import { put, takeEvery } from 'redux-saga/effects'
import { success } from 'redux-saga-requests'
import { LOGIN, SIGNUP } from '../actions/home'
import { setUserToken, getMyUser } from '../actions/user'

export function * onAuthSuccessSaga ({ payload: { data } }) {
  const { token } = data
  yield put(setUserToken(token))
  yield put(getMyUser())
}

export default function * userSaga () {
  yield takeEvery([success(LOGIN), success(SIGNUP)], onAuthSuccessSaga)
}
