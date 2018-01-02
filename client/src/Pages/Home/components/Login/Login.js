import React from 'react'
import PropTypes from 'prop-types'
import './Login.scss'
import LoginForm from './LoginForm'

export default class Login extends React.Component {
  static propTypes = {
    switchToSignup: PropTypes.func.isRequired,
    onLogin: PropTypes.func.isRequired,
    error: PropTypes.shape()
  }

  onLogin = ({ email, password }) => {
    this.props.onLogin(email, password)
  }

  render () {
    const { switchToSignup, error } = this.props

    return (
      <div className="login-component">
        <div className="box">
          <h3 className="title has-text-dark is-spaced">Iniciar Sesión</h3>
          <p className="subtitle has-text-dark">
            Para continuar escriba sus credenciales
          </p>
          {error && (
            <p className="subtitle has-text-danger is-6">
              Hubo un error al intentar iniciar sesión.
              <br />
              Verifique sus credenciales.
            </p>
          )}
          <LoginForm onSubmit={this.onLogin} />
        </div>
        <p className="subtitle has-text-dark is-6">
          <span>No tienes una cuenta? </span>
          <a onClick={switchToSignup}>Crea una ahora</a>
        </p>
      </div>
    )
  }
}
