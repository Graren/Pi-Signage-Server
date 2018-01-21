import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import Breadcrumb from '../../../../components/Breadcrumb'
import { getMyGroups } from '../../../../actions/groups'

const axiosInstance = axios.create({ baseURL: 'http://localhost:8000' })

class Groups extends React.Component {
  static propTypes = {
    token: PropTypes.string,
    getMyGroups: PropTypes.func,
    groups: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        nombre: PropTypes.string
      })
    )
  }

  constructor (props) {
    super(props)
    this.state = {
      newGroupName: ''
    }
  }

  componentDidMount () {
    this.props.getMyGroups()
  }

  createGroup = () => {
    const { newGroupName } = this.state
    const headers = {
      Authorization: `Bearer ${this.props.token}`
    }
    axiosInstance
      .post('/api/v1/deviceGroup/', { nombre: newGroupName }, { headers })
      .then(this.props.getMyGroups)
  }

  render () {
    const breadcrumbRoutes = [
      { name: 'Grupos', url: '/admin/groups', active: true }
    ]
    return (
      <div>
        <Breadcrumb routes={breadcrumbRoutes} />
        <div className="field is-grouped">
          <p className="control">
            <input
              className="input"
              type="text"
              placeholder="Grupo"
              value={this.state.newGroupName}
              onChange={e => this.setState({ newGroupName: e.target.value })}
            />
          </p>
          <p className="control">
            <button className="button is-info" onClick={this.createGroup}>
              Crear
            </button>
          </p>
        </div>
        <ul>
          {this.props.groups.map(group => (
            <li key={group.id}>
              <NavLink to={`/admin/group/${group.id}`}>{group.nombre}</NavLink>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { data } = state.groups
  return {
    groups: data ? data.objects : [],
    token: state.user.token
  }
}

export default connect(mapStateToProps, { getMyGroups })(Groups)
