import { TOGGLE_NAVBAR_MENU } from '../actions/navbar'

const initialState = {
  isMenuOpen: false
}

const navbarReducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_NAVBAR_MENU: {
      return {
        ...state,
        isMenuOpen: !state.isMenuOpen
      }
    }
    default:
      return state
  }
}

export default navbarReducer
