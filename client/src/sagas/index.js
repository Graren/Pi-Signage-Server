import { call, all } from 'redux-saga/effects'
import axios from 'axios'
import { createRequestInstance, watchRequests } from 'redux-saga-requests'
import axiosDriver from 'redux-saga-requests-axios'

import userSaga from './user'
import watchAuthRequests from './watchAuthRequests'

const axiosInstance = axios.create({ baseURL: 'http://localhost:8000' })

function * appSaga () {
  yield all([userSaga(), watchRequests(), watchAuthRequests()])
}

export default function * rootSaga () {
  yield createRequestInstance(axiosInstance, { driver: axiosDriver })
  yield call(appSaga)
}
