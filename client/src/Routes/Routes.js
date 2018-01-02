import React from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/es/integration/react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Home from '../Pages/Home/Home'
import { Admin } from '../Pages/Admin/Admin'
import store, { persistor } from '../store'

export class Routes extends React.Component {
  render () {
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <Router>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/admin" component={Admin} />
              <Route
                render={() => {
                  return (
                    <p>
                      You're lost. This is how new Router Switch is suppose to
                      work!
                    </p>
                  )
                }}
              />
            </Switch>
          </Router>
        </PersistGate>
      </Provider>
    )
  }
}
