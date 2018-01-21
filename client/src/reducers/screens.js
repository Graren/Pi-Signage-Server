import { requestsReducer } from 'redux-saga-requests'
import { GET_MY_SCREENS } from '../actions/screens'

const screensReducer = requestsReducer({ actionType: GET_MY_SCREENS })

export default screensReducer
