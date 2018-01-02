export const SWITCH_TO_LOGIN = 'SWITCH_TO_LOGIN'
export const SWITCH_TO_SIGNUP = 'SWITCH_TO_SIGNUP'
export const LOGIN = 'LOGIN'
export const SIGNUP = 'SIGNUP'

export const switchToLogin = () => {
  return {
    type: SWITCH_TO_LOGIN
  }
}

export const switchToSignup = () => {
  return {
    type: SWITCH_TO_SIGNUP
  }
}

export const login = (email, password) => ({
  type: LOGIN,
  request: {
    url: '/api/v1/user/login/',
    method: 'POST',
    data: { email, password }
  }
})

export const signup = signupData => ({
  type: SIGNUP,
  request: {
    url: '/api/v1/user/',
    method: 'POST',
    data: signupData
  }
})
