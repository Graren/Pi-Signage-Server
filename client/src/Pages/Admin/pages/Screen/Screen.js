import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import axios from 'axios'
import ReactTable from 'react-table'

import './Screen.scss'
import Breadcrumb from '../../../../components/Breadcrumb'
import { getScreenById } from '../../../../actions/screens'
import { getMyGroups } from '../../../../actions/groups'
import { getPlaylistById } from '../../../../actions/playlists'

const axiosInstance = axios.create({ baseURL: 'http://localhost:8000' })

class Screen extends React.Component {
  state = {
    playlistFiles: []
  }

  static propTypes = {
    match: PropTypes.shape(),
    token: PropTypes.string,
    screen: PropTypes.shape({
      id: PropTypes.number,
      nombre: PropTypes.string
    }),
    getScreenById: PropTypes.func,
    getPlaylistById: PropTypes.func,
    getMyGroups: PropTypes.func
  }

  componentWillMount () {
    const { match } = this.props
    this.props.getScreenById(match.params.screen_id)
    this.props.getMyGroups()
  }

  getPlaylistFiles = listId => {
    const headers = {
      Authorization: `Bearer ${this.props.token}`
    }
    const params = { list: listId }

    axiosInstance
      .get('/api/v1/file/', {
        headers,
        params
      })
      .then(res => {
        this.setState({
          playlistFiles: res.data.objects
        })
      })
  }

  componentWillReceiveProps (newProps) {
    const listId =
      this.props.screen.grupo &&
      this.props.screen.grupo.list &&
      this.props.screen.grupo.list.id
    const newListId =
      newProps.screen.grupo &&
      newProps.screen.grupo.list &&
      newProps.screen.grupo.list.id
    if (typeof newListId === 'number' && listId !== newListId) {
      this.getPlaylistFiles(newListId)
    }
  }

  onGroupChange = e => {
    const groupId = e.target.value
    const screenId = this.props.screen.id
    const headers = {
      Authorization: `Bearer ${this.props.token}`
    }
    axiosInstance
      .put(
        `/api/v1/dispositivo/${screenId}/`,
        { grupo: { pk: groupId } },
        {
          headers
        }
      )
      .then(() => this.props.getScreenById(screenId))
  }

  render () {
    const { match, screen } = this.props
    const breadcrumbRoutes = [{ name: 'Pantallas', url: '/admin/screens' }]

    if (screen.nombre) {
      breadcrumbRoutes.push({
        name: screen.nombre,
        url: match.url,
        active: true
      })
    }

    const screenGroup = this.props.screen.grupo
      ? this.props.screen.grupo.id
      : ''

    const tableI18nOptions = {
      previousText: 'Anteriores',
      nextText: 'Siguientes',
      loadingText: 'Cargando...',
      noDataText: 'No hay archivos todavía',
      pageText: 'Página',
      ofText: 'de',
      rowsText: 'archivos'
    }

    const columns = [
      {
        Header: 'Previsualización',
        width: 135,
        accessor: 'url',
        sortable: false,
        Cell: props =>
          props.original.tipo === 'mp4' ? (
            <video width="135px" height="135px" src={props.value} />
          ) : (
            <img width="135px" height="135px" src={props.value} />
          )
      },
      {
        Header: 'Nombre',
        accessor: 'nombre',
        style: {
          alignSelf: 'center',
          whiteSpace: 'unset',
          textOverflow: 'unset',
          fontWeight: '500'
        }
      },
      {
        Header: 'Formato',
        accessor: 'tipo',
        width: 100,
        style: {
          alignSelf: 'center',
          textAlign: 'center',
          fontWeight: '500',
          textTransform: 'uppercase'
        }
      },
      {
        Header: 'Tiempo',
        accessor: 'tiempo',
        width: 150,
        style: {
          alignSelf: 'center',
          textAlign: 'center'
        },
        Cell: props => props.value && <span>{`${props.value} s`}</span>
      }
    ]

    return (
      <div className="screen-wrapper">
        <Breadcrumb routes={breadcrumbRoutes} />
        <h4 className="title is-4 is-spaced">Detalles</h4>
        <h6 className="subtitle is-6 is-marginless">
          Nombre: {this.props.screen.nombre}
        </h6>
        {this.props.screen.grupo && (
          <h6 className="subtitle is-6 is-marginless">
            Grupo: {this.props.screen.grupo.nombre}
          </h6>
        )}
        <h6 className="subtitle is-6 is-marginless">
          BSSID: {this.props.screen.bssid}
        </h6>
        <h6 className="subtitle is-6 is-spaced">
          {this.props.screen.activo ? 'Activa' : 'Inactivo'}
        </h6>
        <h4 className="title is-4 is-spaced">Grupo</h4>
        <h5 className="subtitle is-5">
          Seleccione el grupo al que pertenezca esta pantalla
        </h5>
        <div className="select group">
          <select onChange={this.onGroupChange} value={screenGroup}>
            {!screenGroup && <option>-</option>}
            {this.props.groups.map(group => (
              <option key={group.id} value={group.id}>
                {group.nombre}
              </option>
            ))}
          </select>
        </div>
        <h4 className="title is-4 is-spaced">Lista de Reproducción</h4>
        <ReactTable
          defaultPageSize={4}
          resizable={false}
          data={this.state.playlistFiles}
          columns={columns}
          {...tableI18nOptions}
        />
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { data } = state.screenById
  const { data: groupsData } = state.groups
  return {
    groups: groupsData ? groupsData.objects : [],
    screen: data || {},
    token: state.user.token
  }
}

export default connect(mapStateToProps, {
  getScreenById,
  getMyGroups,
  getPlaylistById
})(Screen)
