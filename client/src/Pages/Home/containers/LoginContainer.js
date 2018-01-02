import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { switchToSignup, login } from '../../../actions/home'
import Login from '../components/Login'

class LoginContainer extends React.Component {
  static propTypes = {
    switchToSignup: PropTypes.func,
    login: PropTypes.func,
    error: PropTypes.shape()
  }

  render () {
    return (
      <Login
        switchToSignup={this.props.switchToSignup}
        onLogin={this.props.login}
        error={this.props.error}
      />
    )
  }
}

const mapStateToProps = state => ({
  error: state.home.login.error
})

export default connect(mapStateToProps, { switchToSignup, login })(
  LoginContainer
)
