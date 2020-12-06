const visibilityReducer = (state = false, action) => {
  switch (action.type) {
    case 'TOGGLE':
      return !state
    default:
      return state
  }
}

export const toggleVisibility = () => {
  return {
    type: 'TOGGLE',
  }
}

export default visibilityReducer
