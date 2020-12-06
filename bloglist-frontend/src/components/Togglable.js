import { Button } from '@material-ui/core'
import React from 'react'
import { useDispatch } from 'react-redux'
import { useAppState } from '../hooks'
import { toggleVisibility } from '../reducers/visibilyReducer'

const Togglable = (props) => {
  const dispatch = useDispatch()
  const { visible } = useAppState()

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const handleVisibility = () => {
    dispatch(toggleVisibility())
  }

  return (
    <div>
      <div style={hideWhenVisible}>
        <Button onClick={handleVisibility}>{props.buttonLabel}</Button>
      </div>
      <div style={showWhenVisible} className="togglableContent">
        {props.children}
        <Button onClick={handleVisibility}>cancel</Button>
      </div>
    </div>
  )
}

Togglable.displayName = 'Togglable'

export default Togglable
