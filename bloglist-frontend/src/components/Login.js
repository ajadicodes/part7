import React, { useState } from 'react'
import Notification from './Notification'
import loginService from '../services/login'
import { notifyWith } from '../reducers/notificationReducer'
import { useDispatch } from 'react-redux'
import storage from '../utils/storage'
import { setUser } from '../reducers/userReducer'
import { useHistory } from 'react-router-dom'
import { TextField, Button, Typography } from '@material-ui/core'

const Login = ({ notification }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()
  const history = useHistory()

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username,
        password,
      })

      setUsername('')
      setPassword('')
      dispatch(setUser(user))
      dispatch(notifyWith(`${user.name} welcome back!`, 5))
      storage.saveUser(user)
      history.push('/')
    } catch (exception) {
      dispatch(notifyWith('wrong username/password', 5, false))
      setUsername('')
      setPassword('')
    }
  }

  return (
    <div>
      <Notification notification={notification} />

      <Typography component="h1" variant="h5">
        login to application
      </Typography>

      <form onSubmit={handleLogin}>
        <div>
          <TextField
            id="username"
            label="username"
            onChange={({ target }) => setUsername(target.value)}
            value={username}
            required
            type="text"
          />
        </div>
        <div>
          <TextField
            id="password"
            label="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            type="password"
            required
          />
        </div>
        <div>
          <Button id="login" variant="contained" color="primary" type="submit">
            login
          </Button>
        </div>
      </form>
    </div>
  )
}

export default Login
