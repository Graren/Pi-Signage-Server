import { requestsReducer } from 'redux-saga-requests'
import { GET_USER_STATS } from '../actions/user'

const userStatsReducer = requestsReducer({ actionType: GET_USER_STATS })

export default userStatsReducer
