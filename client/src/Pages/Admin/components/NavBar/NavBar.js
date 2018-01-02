import React from 'react'
import PropTypes from 'prop-types'
import cl from 'classnames'
import { NavLink } from 'react-router-dom'
import './NavBar.scss'

import Hamburger from '../../../../components/Hamburger'

const NavBar = props => {
  const { toggleNavbarMenu, isMenuOpen, logout } = props
  const onLogout = () => {
    logout()
    toggleNavbarMenu()
  }
  return (
    <nav className="navbar is-white has-margin bottom-lg">
      <div className="container">
        <div className="navbar-brand">
          <NavLink className="navbar-item brand-text" to="/admin">
            DigitalPignage
          </NavLink>
          <Hamburger onClick={toggleNavbarMenu} />
        </div>
        <div className={cl('navbar-menu', isMenuOpen && 'is-active')}>
          <div className="navbar-end">
            <a className="navbar-item" onClick={onLogout}>
              Cerrar sesión
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}

NavBar.propTypes = {
  isMenuOpen: PropTypes.bool,
  toggleNavbarMenu: PropTypes.func,
  logout: PropTypes.func
}

export default NavBar
