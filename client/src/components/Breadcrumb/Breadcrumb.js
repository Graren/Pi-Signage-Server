import React from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import cl from 'classnames'

const Breadcrumb = props => (
  <nav className="breadcrumb" aria-label="breadcrumbs">
    <ul>
      {props.routes.map(route => (
        <li key={route.name} className={cl(route.active && 'is-active')}>
          <NavLink to={route.url}>{route.name}</NavLink>
        </li>
      ))}
    </ul>
  </nav>
)

Breadcrumb.propTypes = {
  routes: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      active: PropTypes.bool
    })
  )
}

export default Breadcrumb
