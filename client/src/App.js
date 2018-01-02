import React from 'react'
import { Routes } from './Routes/Routes'
import 'bulma/css/bulma.css'
import './globals.scss'

export default class App extends React.Component {
  render () {
    return (
      <div>
        <Routes />
      </div>
    )
  }
}
