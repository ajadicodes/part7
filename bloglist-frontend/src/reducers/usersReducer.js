import usersService from '../services/users'

const usersReducer = (state = [], action) => {
  switch (action.type) {
    case 'FETCH_USERS':
      return action.users
    default:
      return state
  }
}

export const setUsers = () => {
  return async (dispatch) => {
    const users = await usersService.getAllUsers()
    dispatch({
      type: 'FETCH_USERS',
      users,
    })
  }
}
export default usersReducer
