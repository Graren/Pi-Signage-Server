// @flow
import { put, takeLatest, takeEvery } from 'redux-saga/effects'
import { success } from 'redux-saga-requests'
import { push as routerPush } from 'react-router-redux'
import { reset as resetForm } from 'redux-form'
import { LOGIN, SIGNUP } from '../actions/home'
import {
  LOGOUT,
  setUserToken,
  getMyUser,
  removeUserData
} from '../actions/user'

export function * onAuthSuccessSaga ({ payload: { data } }) {
  const { token } = data
  yield put(setUserToken(token))
  yield put(getMyUser())
  yield put(resetForm('login'))
  yield put(resetForm('signup'))
  yield put(routerPush('/admin'))
}

export function * onLogoutSaga () {
  yield put(removeUserData())
  yield put(routerPush('/'))
}

export default function * userSaga () {
  yield takeLatest(LOGOUT, onLogoutSaga)
  yield takeEvery([success(LOGIN), success(SIGNUP)], onAuthSuccessSaga)
}
