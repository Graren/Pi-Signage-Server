import React from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import Breadcrumb from '../../../../components/Breadcrumb'

class Playlists extends React.Component {
  render () {
    const breadcrumbRoutes = [
      { name: 'Listas de reproducción', url: '/admin/playlists', active: true }
    ]
    return (
      <div>
        <Breadcrumb routes={breadcrumbRoutes} />
        <section className="hero is-info welcome is-small">
          <div className="hero-body">
            <div className="container">
              <h1 className="title">Listas de reproducción</h1>
              <h2 className="subtitle">I hope you are having a great day!</h2>
            </div>
          </div>
        </section>
        <NavLink to="/admin/playlist/5">Test</NavLink>
      </div>
    )
  }
}

export default Playlists
