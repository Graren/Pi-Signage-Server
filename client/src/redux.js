import { compose, applyMiddleware, createStore } from 'redux'
import { persistStore, persistCombineReducers } from 'redux-persist'
import storage from 'redux-persist/es/storage'
import createSagaMiddleware from 'redux-saga'
import axios from 'axios'

import createHistory from 'history/createBrowserHistory'
import { routerMiddleware as createRouterMiddleware } from 'react-router-redux'

import reducers from './reducers'
import rootSaga from './sagas'

const config = {
  key: 'root',
  storage
}

export const history = createHistory()

const getRootReducer = reducers => {
  return persistCombineReducers(config, reducers)
}

export const configureStore = () => {
  const rootReducer = getRootReducer(reducers)

  const sagaMiddleware = createSagaMiddleware()
  const routerMiddleware = createRouterMiddleware(history)

  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
  const createMiddlewareStore = composeEnhancers(
    applyMiddleware(sagaMiddleware, routerMiddleware)
  )(createStore)

  const axiosInstance = axios.create({ baseURL: 'http://localhost:8000' })

  const store = createMiddlewareStore(rootReducer)
  sagaMiddleware.run(rootSaga, axiosInstance)

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      const nextRootReducer = getRootReducer(require('./reducers').default)
      store.replaceReducer(nextRootReducer)
    })

    module.hot.accept('./sagas', () => {
      console.warn("Can't hot reload sagas")
    })
  }

  return {
    store,
    persistor: persistStore(store)
  }
}
