import { compose, applyMiddleware, createStore } from 'redux'
import createSagaMiddleware from 'redux-saga'
import axios from 'axios'

import rootReducer from './reducers'
import rootSaga from './sagas'

const sagaMiddleware = createSagaMiddleware()

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const createMiddlewareStore = composeEnhancers(applyMiddleware(sagaMiddleware))(
  createStore
)

const store = createMiddlewareStore(rootReducer)

const axiosInstance = axios.create({ baseURL: 'http://localhost:8000' })
sagaMiddleware.run(rootSaga, axiosInstance)

export default store
