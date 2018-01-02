import React from 'react'
import cl from 'classnames'
import PropTypes from 'prop-types'

const Title = props => (
  <h1 className={cl('title is-2 has-text-dark', props.className)}>
    <span className='icon is-large'>
      <i className='fa fa-desktop' />
    </span>
    <br />
    <strong>Digital Pignage</strong>
  </h1>
)

Title.propTypes = {
  className: PropTypes.string
}

export default Title
