import React from 'react'
import { Route } from 'react-router-dom'
import { ConnectedRouter } from 'react-router-redux'
import { history } from '../redux'
import Home from '../Pages/Home/Home'
import { Admin } from '../Pages/Admin/Admin'

export class Routes extends React.Component {
  render () {
    return (
      <ConnectedRouter history={history}>
        <div>
          <Route exact path="/" component={Home} />
          <Route path="/admin" component={Admin} />
          <Route
            render={() => {
              return (
                <p>
                  You're lost. This is how new Router Switch is suppose to work!
                </p>
              )
            }}
          />
        </div>
      </ConnectedRouter>
    )
  }
}
