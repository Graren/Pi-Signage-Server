import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { push as routerPush } from 'react-router-redux'

import './Home.scss'

import Title from './components/Title'
import LoginContainer from './containers/LoginContainer'
import SignupContainer from './containers/SignupContainer'

class Home extends React.Component {
  static propTypes = {
    authMode: PropTypes.string,
    isLoggedIn: PropTypes.bool,
    goToAdminPanel: PropTypes.func
  }

  componentDidMount () {
    if (this.props.isLoggedIn) {
      this.props.goToAdminPanel()
    }
  }

  renderAuthSection = () => {
    const { authMode } = this.props
    if (authMode === 'login') {
      return <LoginContainer />
    } else if (authMode === 'signup') {
      return <SignupContainer />
    } else {
      return null
    }
  }

  render () {
    return (
      <section className="hero is-fullheight login">
        <div className="hero-body">
          <div className="container has-text-centered">
            <Title className="is-spaced" />
            <h2 className="subtitle is-4">Panel de Administración</h2>
            {this.renderAuthSection()}
          </div>
        </div>
      </section>
    )
  }
}

const mapStateToProps = state => {
  return {
    authMode: state.home.authMode,
    isLoggedIn: !!state.user.token
  }
}

const mapDispatchToProps = dispatch => {
  return {
    goToAdminPanel: () => dispatch(routerPush('/admin'))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
