import React from 'react'
import PropTypes from 'prop-types'
import { Field, reduxForm } from 'redux-form'

const LoginForm = props => (
  <form className="login-form" onSubmit={props.handleSubmit}>
    <div className="field">
      <div className="control">
        <Field
          component="input"
          name="email"
          className="input is-medium"
          type="email"
          placeholder="Email"
        />
      </div>
    </div>
    <div className="field">
      <div className="control">
        <Field
          component="input"
          name="password"
          className="input is-medium"
          type="password"
          placeholder="Contraseña"
        />
      </div>
    </div>
    <button className="button is-info is-large" type="submit">
      Ingresar
    </button>
  </form>
)

LoginForm.propTypes = {
  handleSubmit: PropTypes.func
}

export default reduxForm({ form: 'login', destroyOnUnmount: false })(LoginForm)
