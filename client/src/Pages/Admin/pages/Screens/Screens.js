import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import ReactTable from 'react-table'
import Breadcrumb from '../../../../components/Breadcrumb'
import { getMyScreens } from '../../../../actions/screens'

import './Screens.scss'

const axiosInstance = axios.create({ baseURL: 'http://localhost:8000' })

class Screens extends React.Component {
  static propTypes = {
    token: PropTypes.string,
    getMyScreens: PropTypes.func,
    screens: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        nombre: PropTypes.string
      })
    )
  }

  componentDidMount () {
    this.props.getMyScreens()
  }

  deleteScreen = screenId => {
    const headers = {
      Authorization: `Bearer ${this.props.token}`
    }

    axiosInstance
      .delete(`/api/v1/dispositivo/${screenId}/`, { headers })
      .then(this.props.getMyScreens)
  }

  render () {
    const breadcrumbRoutes = [
      { name: 'Pantallas', url: '/admin/screens', active: true }
    ]

    const tableI18nOptions = {
      previousText: 'Anteriores',
      nextText: 'Siguientes',
      loadingText: 'Cargando...',
      noDataText: 'No hay pantallas todavía',
      pageText: 'Página',
      ofText: 'de',
      rowsText: 'pantallas'
    }

    const columns = [
      {
        Header: 'Nombre',
        accessor: 'nombre',
        sortable: true,
        style: {
          alignSelf: 'center',
          whiteSpace: 'unset',
          textAlign: 'center',
          textOverflow: 'unset',
          fontWeight: '600'
        },
        Cell: props => (
          <NavLink
            className="screen-link"
            to={`/admin/screen/${props.original.id}`}
          >
            {props.value}
          </NavLink>
        )
      },
      {
        Header: 'Grupo',
        accessor: 'grupo',
        style: {
          alignSelf: 'center',
          whiteSpace: 'unset',
          textAlign: 'center',
          textOverflow: 'unset'
        },
        Cell: props =>
          props.value && (
            <NavLink to={`/admin/group/${props.value.id}`}>
              {props.value.nombre}
            </NavLink>
          )
      },
      {
        Header: 'BSSID',
        accessor: 'bssid',
        style: {
          alignSelf: 'center',
          textAlign: 'center',
          textTransform: 'uppercase'
        }
      },
      {
        Header: 'Activa',
        accessor: 'activo',
        style: {
          alignSelf: 'center',
          textAlign: 'center',
          whiteSpace: 'unset',
          textOverflow: 'unset'
        },
        Cell: props => <span>{props.value ? 'Activa' : 'Inactiva'}</span>
      },
      {
        Header: 'Administrar',
        accessor: null,
        style: {
          alignSelf: 'center',
          justifyContent: 'center',
          display: 'flex'
        },
        Cell: props =>
          !props.original.activo && (
            <button
              className="button is-danger"
              onClick={() => this.deleteScreen(props.original.id)}
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
        {this.props.screens.length > 0 && (
          <ReactTable
            defaultPageSize={10}
            defaultSorted={[
              {
                id: 'activo',
                desc: true
              }
            ]}
            resizable={false}
            data={this.props.screens}
            columns={columns}
            {...tableI18nOptions}
          />
        )}
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { data } = state.screens
  return {
    screens: data ? data.objects : [],
    token: state.user.token
  }
}

export default connect(mapStateToProps, { getMyScreens })(Screens)
