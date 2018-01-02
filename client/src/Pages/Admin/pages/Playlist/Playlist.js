import React from 'react'
import PropTypes from 'prop-types'
import DropzoneS3Uploader from 'react-dropzone-s3-uploader'
import uuidv4 from 'uuid/v4'

import './Playlist.scss'
import Breadcrumb from '../../../../components/Breadcrumb'

const uploadOptions = {
  server: 'http://localhost:8000',
  signingUrl: '/s3/sign'
  // autoUpload: false,
  // getSignedUrl: (file, upload) => {
  //   const id = uuidv4()
  //   upload({
  //     // fileUrl: `http://localhost:4569/test-bucket/${id}`,
  //     signedUrl: `http://localhost:4569/test-bucket/${id}`
  //   })
  // }
}

class Playlist extends React.Component {
  static propTypes = {
    match: PropTypes.shape()
  }

  constructor (props) {
    super(props)
    this.state = {
      files: [],
      filesProgress: {}
    }
  }

  onDrop = files => {
    this.setState(state => ({
      files: state.files.concat(files)
    }))
  }

  handleFinishedUpload = info => {
    console.log('final', info)
  }

  onDropzoneProgress = (progress, textState, file) => {
    this.setState(state => ({
      filesProgress: {
        ...state.filesProgress,
        [file.name]: progress
      }
    }))
  }

  render () {
    const { match } = this.props
    const { files, filesProgress } = this.state
    const breadcrumbRoutes = [
      { name: 'Listas de reproducción', url: '/admin/playlists' },
      { name: 'Lista', url: match.url, active: true }
    ]
    return (
      <div>
        <Breadcrumb routes={breadcrumbRoutes} />
        <h6 className="subtitle is-6">Sube tu contenido</h6>
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
                Progreso
              </h5>
              <table className="table">
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
                      <td>Video</td>
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
    )
  }
}

export default Playlist
