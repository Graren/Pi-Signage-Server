import { requestsReducer } from 'redux-saga-requests'
import { GET_GROUP_BY_ID } from '../actions/groups'

const groupByIdReducer = requestsReducer({ actionType: GET_GROUP_BY_ID })

export default groupByIdReducer
