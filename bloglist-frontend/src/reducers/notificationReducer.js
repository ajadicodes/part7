const notificationReducer = (
  state = { message: null, isSuccess: false },
  action
) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return { message: action.message, isSuccess: action.isSuccess }
    case 'REMOVE_NOTIFICATION':
      return { ...state, message: null }
    default:
      return state
  }
}

// actions

export const notifyWith = (message, waitFor, isSuccess = true) => {
  return async (dispatch) => {
    dispatch({
      type: 'SET_NOTIFICATION',
      message,
      isSuccess,
    })

    setTimeout(() => {
      dispatch(removeNotification())
    }, waitFor * 1000)
  }
}

export const removeNotification = () => {
  return {
    type: 'REMOVE_NOTIFICATION',
  }
}

export default notificationReducer
