import { requestsReducer } from 'redux-saga-requests'
import { GET_MY_GROUPS } from '../actions/groups'

const groupsReducer = requestsReducer({ actionType: GET_MY_GROUPS })

export default groupsReducer
