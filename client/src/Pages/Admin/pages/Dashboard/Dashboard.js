import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getUserStats } from '../../../../actions/user'

import './Dashboard.scss'

class Dashboard extends React.Component {
  static propTypes = {
    getUserStats: PropTypes.func,
    userStats: PropTypes.shape({
      groups: PropTypes.number,
      screens: PropTypes.number,
      playlists: PropTypes.number
    })
  }

  componentWillMount () {
    this.props.getUserStats()
  }

  render () {
    return (
      <div className="dashboard">
        <section className="hero is-info welcome is-small">
          <div className="hero-body">
            <div className="container">
              <h1 className="title is-spaced">
                Bienvenido a su panel de administración
              </h1>
              <h2 className="subtitle">
                Aqui podras controlar todos tus dispositivos de publicidad
              </h2>
            </div>
          </div>
        </section>
        <section className="info-tiles">
          <div className="tile is-ancestor has-text-centered">
            <div className="tile is-parent">
              <article className="tile is-child box">
                <p className="title">{this.props.userStats.screens}</p>
                <p className="subtitle">Pantallas</p>
              </article>
            </div>
            <div className="tile is-parent">
              <article className="tile is-child box">
                <p className="title">{this.props.userStats.groups}</p>
                <p className="subtitle">Grupos</p>
              </article>
            </div>
            <div className="tile is-parent">
              <article className="tile is-child box">
                <p className="title">{this.props.userStats.playlists}</p>
                <p className="subtitle">Listas de Reproducción</p>
              </article>
            </div>
          </div>
        </section>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { data } = state.userStats
  return {
    userStats: data || {},
    token: state.user.token
  }
}

export default connect(mapStateToProps, { getUserStats })(Dashboard)
