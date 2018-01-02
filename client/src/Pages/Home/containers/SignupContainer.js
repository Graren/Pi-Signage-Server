import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { switchToLogin, signup } from '../../../actions/home'
import Signup from '../components/Signup'

class LoginContainer extends React.Component {
  static propTypes = {
    switchToLogin: PropTypes.func,
    signup: PropTypes.func,
    error: PropTypes.shape()
  }

  render () {
    return (
      <Signup
        switchToLogin={this.props.switchToLogin}
        onSignup={this.props.signup}
        error={this.props.error}
      />
    )
  }
}

const mapStateToProps = state => ({
  error: state.home.signup.error
})

export default connect(mapStateToProps, { switchToLogin, signup })(
  LoginContainer
)
