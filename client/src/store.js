import { compose, applyMiddleware, createStore } from 'redux'
import { persistStore, persistCombineReducers } from 'redux-persist'
import storage from 'redux-persist/es/storage'
import createSagaMiddleware from 'redux-saga'
import axios from 'axios'

import reducers from './reducers'
import rootSaga from './sagas'

const config = {
  key: 'root',
  storage
}

const rootReducer = persistCombineReducers(config, reducers)

const sagaMiddleware = createSagaMiddleware()

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const createMiddlewareStore = composeEnhancers(applyMiddleware(sagaMiddleware))(
  createStore
)

const store = createMiddlewareStore(rootReducer)

const axiosInstance = axios.create({ baseURL: 'http://localhost:8000' })
sagaMiddleware.run(rootSaga, axiosInstance)

export const persistor = persistStore(store)
export default store
