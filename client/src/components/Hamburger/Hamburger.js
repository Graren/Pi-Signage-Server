import React from 'react'
import PropTypes from 'prop-types'

const Hamburger = props => (
  <div
    className="navbar-burger burger"
    data-target="navMenu"
    onClick={props.onClick}
  >
    <span />
    <span />
    <span />
  </div>
)

Hamburger.propTypes = {
  onClick: PropTypes.func.isRequired
}

export default Hamburger
