import React from 'react'
import PropTypes from 'prop-types'
import { Field, reduxForm } from 'redux-form'

const SignupForm = props => (
  <form className="signup-form" onSubmit={props.handleSubmit}>
    <div className="field">
      <div className="control">
        <Field
          name="name"
          component="input"
          className="input is-medium"
          type="text"
          placeholder="Nombre / Organizacion"
        />
      </div>
    </div>
    <div className="field">
      <div className="control">
        <Field
          name="email"
          component="input"
          className="input is-medium"
          type="email"
          placeholder="Email"
        />
      </div>
    </div>
    <div className="field">
      <div className="control">
        <Field
          name="password"
          component="input"
          className="input is-medium"
          type="password"
          placeholder="Contraseña"
        />
      </div>
    </div>
    <button className="button is-block is-info is-large" type="submit">
      Crear
    </button>
  </form>
)

SignupForm.propTypes = {
  handleSubmit: PropTypes.func
}

export default reduxForm({ form: 'signup', destroyOnUnmount: false })(
  SignupForm
)
