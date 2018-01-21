import React from 'react'
import { Route, Switch, NavLink } from 'react-router-dom'
import NavBar from './containers/NavBarContainer'

import Dashboard from './pages/Dashboard'
import Playlists from './pages/Playlists'
import Playlist from './pages/Playlist'
import Groups from './pages/Groups'
import Group from './pages/Group'
import Screens from './pages/Screens'
import Screen from './pages/Screen'

export default class Admin extends React.Component {
  render () {
    const { match } = this.props
    return (
      <div>
        <NavBar />
        <div className="container">
          <div className="columns">
            <div className="column is-3">
              <aside className="menu">
                <p className="menu-label">General</p>
                <ul className="menu-list">
                  <li>
                    <NavLink to={`${match.url}`}>Tablero</NavLink>
                  </li>
                </ul>
                <p className="menu-label">Administración</p>
                <ul className="menu-list">
                  <li>
                    <NavLink to={`${match.url}/screens`}>Pantallas</NavLink>
                  </li>
                  <li>
                    <NavLink to={`${match.url}/groups`}>Grupos</NavLink>
                  </li>
                  <li>
                    <NavLink to={`${match.url}/playlists`}>
                      Listas de reproducción
                    </NavLink>
                  </li>
                </ul>
              </aside>
            </div>
            <div className="column is-9">
              <Route>
                <Switch>
                  <Route exact path={`${match.url}/`} component={Dashboard} />
                  <Route
                    path={`${match.url}/playlists`}
                    component={Playlists}
                  />
                  <Route
                    path={`${match.url}/playlist/:playlist_id`}
                    component={Playlist}
                  />
                  <Route path={`${match.url}/groups`} component={Groups} />
                  <Route
                    path={`${match.url}/group/:group_id`}
                    component={Group}
                  />
                  <Route path={`${match.url}/screens`} component={Screens} />
                  <Route
                    path={`${match.url}/screen/:screen_id`}
                    component={Screen}
                  />
                  <Route
                    render={() => {
                      return (
                        <p>
                          You're lost. This is how new Router Switch is suppose
                          to work!
                        </p>
                      )
                    }}
                  />
                </Switch>
              </Route>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
