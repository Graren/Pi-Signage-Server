import React from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/es/integration/react'
import { Routes } from './Routes/Routes'
import { configureStore } from './redux'
import 'bulma/css/bulma.css'
import 'react-table/react-table.css'
import './globals.scss'

const { store, persistor } = configureStore()

export default class App extends React.Component {
  render () {
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <Routes />
        </PersistGate>
      </Provider>
    )
  }
}
