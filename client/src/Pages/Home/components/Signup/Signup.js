import React from 'react'
import PropTypes from 'prop-types'
import './Signup.scss'
import SignupForm from './SignupForm'

export default class Signup extends React.Component {
  static propTypes = {
    switchToLogin: PropTypes.func,
    onSignup: PropTypes.func,
    error: PropTypes.shape()
  }

  onSignup = ({ name, email, password }) => {
    this.props.onSignup({
      nombre: name,
      email,
      password
    })
  }

  render () {
    const { switchToLogin, error } = this.props

    return (
      <div className="signup-component">
        <div className="box">
          <h3 className="title has-text-dark is-spaced">Crea tu cuenta</h3>
          <p className="subtitle has-text-dark">
            Completa los siguientes campos
          </p>
          {error && (
            <p className="subtitle has-text-danger is-6">
              Hubo un error al intentar crear esta cuenta.
              <br />
              Verifica los campos o intente mas tarde.
            </p>
          )}
          <SignupForm onSubmit={this.onSignup} />
        </div>
        <p className="subtitle has-text-dark is-6">
          <span>Ya tienes una cuenta? </span>
          <a onClick={switchToLogin}>Inicia sesión</a>
        </p>
      </div>
    )
  }
}
