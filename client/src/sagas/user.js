// @flow
import { put, takeEvery } from 'redux-saga/effects'
import { success } from 'redux-saga-requests'
import { push as routerPush } from 'react-router-redux'
import { LOGIN, SIGNUP } from '../actions/home'
import { setUserToken, getMyUser } from '../actions/user'

export function * onAuthSuccessSaga ({ payload: { data } }) {
  const { token } = data
  yield put(setUserToken(token))
  yield put(getMyUser())
  yield put(routerPush('/admin'))
}

export default function * userSaga () {
  yield takeEvery([success(LOGIN), success(SIGNUP)], onAuthSuccessSaga)
}
