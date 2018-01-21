export const GET_MY_GROUPS = 'GET_MY_GROUPS'
export const GET_GROUP_BY_ID = 'GET_GROUP_BY_ID'

export const getMyGroups = () => {
  return {
    type: GET_MY_GROUPS,
    authRequest: { url: '/api/v1/deviceGroup/' }
  }
}

export const getGroupById = id => {
  return {
    type: GET_GROUP_BY_ID,
    authRequest: { url: `/api/v1/deviceGroup/${id}/` }
  }
}
