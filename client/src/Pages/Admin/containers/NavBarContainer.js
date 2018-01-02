import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import NavBar from '../components/NavBar'
import { toggleNavbarMenu } from '../../../actions/navbar'
import { logout } from '../../../actions/user'

class NavBarContainer extends React.Component {
  static propTypes = {
    isMenuOpen: PropTypes.bool,
    toggleNavbarMenu: PropTypes.func,
    logout: PropTypes.func
  }

  render () {
    return (
      <NavBar
        isMenuOpen={this.props.isMenuOpen}
        toggleNavbarMenu={this.props.toggleNavbarMenu}
        logout={this.props.logout}
      />
    )
  }
}

const mapStateToProps = state => ({
  isMenuOpen: state.navbar.isMenuOpen
})

export default connect(mapStateToProps, { toggleNavbarMenu, logout })(
  NavBarContainer
)
