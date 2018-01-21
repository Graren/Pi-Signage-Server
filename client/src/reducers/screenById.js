import { requestsReducer } from 'redux-saga-requests'
import { GET_SCREEN_BY_ID } from '../actions/screens'

const screenByIdReducer = requestsReducer({ actionType: GET_SCREEN_BY_ID })

export default screenByIdReducer
