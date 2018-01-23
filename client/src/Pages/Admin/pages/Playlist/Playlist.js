import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import DropzoneS3Uploader from 'react-dropzone-s3-uploader'
import axios from 'axios'
import uuidv4 from 'uuid/v4'
import fileExtension from 'file-extension'
import ReactTable from 'react-table'

import './Playlist.scss'
import Breadcrumb from '../../../../components/Breadcrumb'
import { getPlaylistById } from '../../../../actions/playlists'

const axiosInstance = axios.create({ baseURL: 'http://localhost:8000' })
let uploadOptions = {}

if (process.env.NODE_ENV === 'production') {
  uploadOptions = {
    server: 'http://localhost:8000',
    signingUrl: '/s3/sign'
  }
} else {
  uploadOptions = {
    getSignedUrl: (file, upload) => {
      const id = uuidv4()
      upload({
        fileUrl: `http://192.168.2.150:4569/test-bucket/${id}`,
        signedUrl: `http://192.168.2.150:4569/test-bucket/${id}`
      })
    }
  }
}

class Playlist extends React.Component {
  static propTypes = {
    match: PropTypes.shape(),
    token: PropTypes.string,
    playlist: PropTypes.shape({
      id: PropTypes.number,
      nombre: PropTypes.string
    }),
    getPlaylistById: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.state = {
      showUploader: false,
      files: [],
      filesProgress: {},
      playlistFiles: []
    }
  }

  getPlaylistFiles = listId => {
    if (!listId) {
      listId = this.props.playlist.id
    }

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

  componentWillMount () {
    const { match } = this.props
    this.props.getPlaylistById(match.params.playlist_id)
    this.getPlaylistFiles(match.params.playlist_id)
  }

  onDrop = files => {
    this.setState(state => ({
      files: state.files.concat(files)
    }))
  }

  handleFinishedUpload = info => {
    const { playlist } = this.props
    const headers = {
      Authorization: `Bearer ${this.props.token}`
    }

    const file = {
      listId: playlist.id,
      nombre: info.file.name,
      tipo: fileExtension(info.file.name),
      url: info.fileUrl
    }

    axiosInstance
      .post('/api/v1/file/', file, { headers })
      .then(() => this.getPlaylistFiles())
  }

  onDropzoneProgress = (progress, textState, file) => {
    this.setState(state => ({
      filesProgress: {
        ...state.filesProgress,
        [file.name]: progress
      }
    }))
  }

  onContentDropdownClick = () => {
    this.setState(state => ({
      showUploader: !state.showUploader
    }))
  }

  updateImageTime = (fileId, time) => {
    const headers = {
      Authorization: `Bearer ${this.props.token}`
    }
    const { playlistFiles } = this.state
    const fileIndex = playlistFiles.findIndex(f => f.id === fileId)
    const updatedFile = {
      ...playlistFiles[fileIndex],
      tiempo: time
    }

    this.setState({
      playlistFiles: [
        ...playlistFiles.slice(0, fileIndex),
        updatedFile,
        ...playlistFiles.slice(fileIndex + 1)
      ]
    })

    axiosInstance.put(`/api/v1/file/${fileId}/`, { tiempo: time }, { headers })
  }

  updateFileFit = (fileId, fit) => {
    const headers = {
      Authorization: `Bearer ${this.props.token}`
    }
    const { playlistFiles } = this.state
    const fileIndex = playlistFiles.findIndex(f => f.id === fileId)
    const updatedFile = {
      ...playlistFiles[fileIndex],
      ajuste: fit
    }

    this.setState({
      playlistFiles: [
        ...playlistFiles.slice(0, fileIndex),
        updatedFile,
        ...playlistFiles.slice(fileIndex + 1)
      ]
    })

    axiosInstance.put(`/api/v1/file/${fileId}/`, { ajuste: fit }, { headers })
  }

  deleteFile = fileId => {
    const headers = {
      Authorization: `Bearer ${this.props.token}`
    }
    const { playlistFiles } = this.state
    const fileIndex = playlistFiles.findIndex(f => f.id === fileId)

    this.setState({
      playlistFiles: [
        ...playlistFiles.slice(0, fileIndex),
        ...playlistFiles.slice(fileIndex + 1)
      ]
    })

    axiosInstance.delete(`/api/v1/file/${fileId}/`, { headers })
  }

  render () {
    const { match, playlist } = this.props
    const { files, filesProgress, showUploader } = this.state
    const breadcrumbRoutes = [
      { name: 'Listas de reproducción', url: '/admin/playlists' }
    ]

    if (playlist.nombre) {
      breadcrumbRoutes.push({
        name: playlist.nombre,
        url: match.url,
        active: true
      })
    }

    const tableI18nOptions = {
      previousText: 'Anteriores',
      nextText: 'Siguientes',
      loadingText: 'Cargando...',
      noDataText: 'No hay archivos todavía',
      pageText: 'Página',
      ofText: 'de',
      rowsText: 'archivos'
    }

    const imageFits = {
      cover: 'Cubrir',
      contain: 'Contener'
    }

    const videoFits = {
      ...imageFits,
      fill: 'Expandir'
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
          alignSelf: 'center'
        },
        Cell: props =>
          props.original.tipo === 'mp4' ? null : (
            <div className="time-input-container">
              <button
                className="button is-primary"
                disabled={props.value === 1}
                onClick={() =>
                  this.updateImageTime(props.original.id, props.value - 1)
                }
              >
                -
              </button>
              <span>{props.value} s</span>
              <button
                className="button is-primary"
                onClick={() =>
                  this.updateImageTime(props.original.id, props.value + 1)
                }
              >
                +
              </button>
            </div>
          )
      },
      {
        Header: 'Ajuste',
        accessor: 'ajuste',
        width: 150,
        style: {
          alignSelf: 'center'
        },
        Cell: props => {
          const fileFits = props.original.tipo === 'mp4' ? videoFits : imageFits
          return (
            <div className="select">
              <select
                value={props.value}
                onChange={e =>
                  this.updateFileFit(props.original.id, e.target.value)
                }
              >
                {Object.keys(fileFits).map(fit => (
                  <option key={fit} value={fit}>
                    {fileFits[fit]}
                  </option>
                ))}
              </select>
            </div>
          )
        }
      },
      {
        Header: 'Acciones',
        accessor: null,
        width: 90,
        style: {
          alignSelf: 'center',
          display: 'flex'
        },
        Cell: props => (
          <button
            className="button is-danger"
            onClick={() => this.deleteFile(props.original.id)}
          >
            <span className="icon is-small">
              <i className="fa fa-trash" />
            </span>
          </button>
        )
      }
    ]

    return (
      <div>
        <Breadcrumb routes={breadcrumbRoutes} />
        <article className="message is-medium">
          <div className="message-header">
            <p>Sube tu contenido</p>
            <button
              className="dropdown-icon"
              onClick={this.onContentDropdownClick}
            >
              <i className={`fa fa-caret-${showUploader ? 'up' : 'down'}`} />
            </button>
          </div>
          {showUploader && (
            <div className="message-body">
              <DropzoneS3Uploader
                style={{}}
                upload={uploadOptions}
                onFinish={this.handleFinishedUpload}
                s3Url="https://s3.amazonaws.com/dr-1807-tesis"
                className="playlist-dropzone"
                notDropzoneProps={[
                  'onFinish',
                  's3Url',
                  'filename',
                  'host',
                  'upload',
                  'isImage',
                  'notDropzoneProps',
                  'onDrop'
                ]}
                onDrop={this.onDrop}
                accept="video/mp4, image/jpeg, image/png"
                passChildrenProps={false}
                onProgress={this.onDropzoneProgress}
              >
                {files.length > 0 ? (
                  <div className="files-container">
                    <h5 className="has-text-centered subtitle is-5 has-text-dark">
                      Archivos
                    </h5>
                    <table className="table is-small">
                      <thead>
                        <tr>
                          <th>Tipo</th>
                          <th>Nombre</th>
                          <th>Progreso</th>
                        </tr>
                      </thead>
                      <tbody>
                        {files.map((f, i) => (
                          <tr key={`${i}-${f.name}`}>
                            <td>
                              {f.type === 'video/mp4' ? 'Video' : 'Imagen'}
                            </td>
                            <td>{f.name}</td>
                            <td>
                              <progress
                                className="progress is-primary is-link is-info is-success"
                                value={filesProgress[f.name]}
                                max="100"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="message-container">
                    <h3 className="title is-5 has-text-dark has-text-centered">
                      Arrastra tus videos y fotos o haz click y seleccionalos
                    </h3>
                  </div>
                )}
              </DropzoneS3Uploader>
            </div>
          )}
        </article>
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
  const { data } = state.playlistById
  return {
    playlist: data || {},
    token: state.user.token
  }
}

export default connect(mapStateToProps, { getPlaylistById })(Playlist)
