import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import axios from 'axios'
import { NavLink } from 'react-router-dom'

import './Group.scss'
import Breadcrumb from '../../../../components/Breadcrumb'
import { getGroupById } from '../../../../actions/groups'
import { getMyPlaylists } from '../../../../actions/playlists'

const axiosInstance = axios.create({ baseURL: 'http://localhost:8000' })

class Group extends React.Component {
  static propTypes = {
    match: PropTypes.shape(),
    token: PropTypes.string,
    playlists: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        nombre: PropTypes.string
      })
    ),
    group: PropTypes.shape({
      id: PropTypes.number,
      nombre: PropTypes.string,
      list: PropTypes.shape({
        id: PropTypes.number,
        nombre: PropTypes.string
      })
    }),
    getGroupById: PropTypes.func,
    getMyPlaylists: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.state = {
      screens: [],
      screensWithoutGroup: [],
      selectedScreen: ''
    }
  }

  getGroupScreens = groupId => {
    if (!groupId) {
      groupId = this.props.group.id
    }

    const headers = {
      Authorization: `Bearer ${this.props.token}`
    }
    const params = { grupo: groupId }
    axiosInstance
      .get('/api/v1/dispositivo/', {
        headers,
        params
      })
      .then(res => {
        this.setState({
          screens: res.data.objects
        })
      })
  }

  getScreensWithoutGroup = () => {
    const headers = {
      Authorization: `Bearer ${this.props.token}`
    }
    return axiosInstance
      .get('/api/v1/dispositivo/?grupo__isnull=true', {
        headers
      })
      .then(res => {
        this.setState({
          screensWithoutGroup: res.data.objects
        })
        return res.data.objects
      })
  }

  removeScreenFromGroup = screenId => {
    const headers = {
      Authorization: `Bearer ${this.props.token}`
    }
    axiosInstance
      .put(
        `/api/v1/dispositivo/${screenId}/`,
        { grupo: null },
        {
          headers
        }
      )
      .then(res => {
        const screenIndex = this.state.screens.findIndex(s => s.id === screenId)
        this.setState(state => ({
          screens: [
            ...state.screens.slice(0, screenIndex),
            ...state.screens.slice(screenIndex + 1)
          ],
          screensWithoutGroup: state.screensWithoutGroup.concat({
            ...state.screens[screenIndex],
            grupo: null
          })
        }))
      })
  }

  addScreenToGroup = () => {
    const headers = {
      Authorization: `Bearer ${this.props.token}`
    }

    const screenId = Number(this.state.selectedScreen)

    if (screenId <= 0) {
      return
    }

    axiosInstance
      .put(
        `/api/v1/dispositivo/${screenId}/`,
        { grupo: { pk: this.props.group.id } },
        {
          headers
        }
      )
      .then(res => {
        const screenIndex = this.state.screensWithoutGroup.findIndex(
          s => s.id === screenId
        )
        const afterScreens = this.state.screensWithoutGroup.slice(
          screenIndex + 1
        )
        this.setState(state => ({
          screensWithoutGroup: [
            ...state.screensWithoutGroup.slice(0, screenIndex),
            ...state.screensWithoutGroup.slice(screenIndex + 1)
          ],
          screens: state.screens.concat({
            ...state.screensWithoutGroup[screenIndex],
            grupo: this.props.group.id
          }),
          selectedScreen: afterScreens.length > 0 ? `${afterScreens[0].id}` : ''
        }))
      })
  }

  onSelectScreenChange = e => {
    this.setState({
      selectedScreen: e.target.value
    })
  }

  onPlaylistChange = e => {
    const playlistId = e.target.value
    const groupId = this.props.group.id
    const headers = {
      Authorization: `Bearer ${this.props.token}`
    }
    axiosInstance
      .put(
        `/api/v1/deviceGroup/${groupId}/`,
        { lista: playlistId },
        {
          headers
        }
      )
      .then(() => this.props.getGroupById(groupId))
  }

  componentWillMount () {
    const { match } = this.props
    this.props.getGroupById(match.params.group_id)
    this.props.getMyPlaylists()
    this.getGroupScreens(match.params.group_id)
    this.getScreensWithoutGroup().then(screens => {
      if (screens.length > 0) {
        this.setState({
          selectedScreen: screens[0].id
        })
      }
    })
  }

  render () {
    const { match, group } = this.props
    const breadcrumbRoutes = [{ name: 'Grupos', url: '/admin/groups' }]

    if (group.nombre) {
      breadcrumbRoutes.push({
        name: group.nombre,
        url: match.url,
        active: true
      })
    }

    return (
      <div className="group-wrapper">
        <Breadcrumb routes={breadcrumbRoutes} />
        <h4 className="title is-4 is-spaced">Lista de reproducción</h4>
        <h5 className="subtitle is-5">
          Seleccione la lista de reproducción para estre grupo
        </h5>
        <div className="select playlist">
          <select
            onChange={this.onPlaylistChange}
            value={this.props.group.list ? this.props.group.list.id : ''}
          >
            {this.props.playlists.map(playlist => (
              <option key={playlist.id} value={playlist.id}>
                {playlist.nombre}
              </option>
            ))}
          </select>
        </div>
        <h4 className="title is-4">Pantallas</h4>
        {this.state.screens.length > 0 && (
          <div className="screens-wrapper">
            {this.state.screens.map(screen => (
              <div className="screen" key={`s${screen.id}}`}>
                <button
                  className="delete-icon"
                  onClick={() => this.removeScreenFromGroup(screen.id)}
                >
                  <i className="fa fa-minus" />
                </button>
                <span className="icon is-large">
                  <i className="fa fa-desktop" />
                </span>
                <NavLink className="name" to="/">
                  {screen.nombre}
                </NavLink>
              </div>
            ))}
          </div>
        )}
        <h4 className="title is-4 is-spaced">Agregar Pantalla al Grupo</h4>
        {this.state.screensWithoutGroup.length > 0 ? (
          <div className="field is-grouped">
            <div className="control">
              <div className="select">
                <select
                  onChange={this.onSelectScreenChange}
                  value={this.state.selectedScreen}
                >
                  {this.state.screensWithoutGroup.map(screen => (
                    <option key={`swg${screen.id}`} value={screen.id}>
                      {screen.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <p className="control">
              <button
                className="button is-info"
                onClick={this.addScreenToGroup}
              >
                Agregar
              </button>
            </p>
          </div>
        ) : (
          <h5 className="subtitle is-5">
            No hay pantallas sin grupo, remueva una pantalla de un grupo para
            agregarla aqui
          </h5>
        )}
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { data } = state.groupById
  const { data: playlistsData } = state.playlists
  return {
    playlists: playlistsData ? playlistsData.objects : [],
    group: data || {},
    token: state.user.token
  }
}

export default connect(mapStateToProps, { getGroupById, getMyPlaylists })(Group)
