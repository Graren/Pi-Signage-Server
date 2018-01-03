import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import Breadcrumb from '../../../../components/Breadcrumb'
import { getMyPlaylists } from '../../../../actions/playlists'

const axiosInstance = axios.create({ baseURL: 'http://localhost:8000' })

class Playlists extends React.Component {
  static propTypes = {
    token: PropTypes.string,
    getMyPlaylists: PropTypes.func,
    playlists: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        nombre: PropTypes.string
      })
    )
  }

  constructor (props) {
    super(props)
    this.state = {
      newListName: ''
    }
  }

  componentDidMount () {
    this.props.getMyPlaylists()
  }

  createPlaylist = () => {
    const { newListName } = this.state
    const headers = {
      Authorization: `Bearer ${this.props.token}`
    }
    axiosInstance
      .post('/api/v1/list/', { nombre: newListName }, { headers })
      .then(this.props.getMyPlaylists)
  }

  render () {
    const breadcrumbRoutes = [
      { name: 'Listas de reproducción', url: '/admin/playlists', active: true }
    ]
    return (
      <div>
        <Breadcrumb routes={breadcrumbRoutes} />
        <div className="field is-grouped">
          <p className="control">
            <input
              className="input"
              type="text"
              placeholder="Lista de reproducción"
              value={this.state.newListName}
              onChange={e => this.setState({ newListName: e.target.value })}
            />
          </p>
          <p className="control">
            <button className="button is-info" onClick={this.createPlaylist}>
              Crear
            </button>
          </p>
        </div>
        <ul>
          {this.props.playlists.map(playlist => (
            <li key={playlist.id}>
              <NavLink to={`/admin/playlist/${playlist.id}`}>
                {playlist.nombre}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { data } = state.playlists
  return {
    playlists: data ? data.objects : [],
    token: state.user.token
  }
}

export default connect(mapStateToProps, { getMyPlaylists })(Playlists)
