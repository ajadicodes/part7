import React, { useEffect } from 'react'

import Notification from './components/Notification'
import Togglable from './components/Togglable'
import NewBlog from './components/NewBlog'
import BlogList from './components/BlogList'

import storage from './utils/storage'

import { useDispatch } from 'react-redux'
import Login from './components/Login'
import { setUser } from './reducers/userReducer'
import Users from './components/Users'
import User from './components/User'

import { Switch, Route, Link } from 'react-router-dom'
import Blog from './components/Blog'
import { useAppState, usePathMatch } from './hooks'
import { Button, AppBar, Toolbar } from '@material-ui/core'

const App = () => {
  const { user, users, blogs, notification } = useAppState()
  const dispatch = useDispatch()

  useEffect(() => {
    const user = storage.loadUser()
    dispatch(setUser(user))
  }, [dispatch])

  const matchedUser = usePathMatch(users, '/users/:id')
  const matchedBlog = usePathMatch(blogs, '/blogs/:id')

  const handleLogout = () => {
    dispatch(setUser(null))
    storage.logoutUser()
  }

  if (!user) {
    return (
      <div>
        <Login notification={notification} />
      </div>
    )
  }

  const navStyle = {
    padding: 5,
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification notification={notification} />

      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/blogs">
            blogs
          </Button>
          <Button color="inherit" component={Link} to="/users">
            users
          </Button>
          <span style={navStyle}>
            {user && user.name} logged in{' '}
            <Button color="inherit" onClick={handleLogout}>
              logout
            </Button>
          </span>
        </Toolbar>
      </AppBar>

      <Switch>
        <Route path="/users/:id">
          <User user={matchedUser} />
        </Route>
        <Route path="/users">
          <Users users={users} />
        </Route>
        <Route path="/blogs/:id">
          <Blog blog={matchedBlog} blogs={blogs} user={user} />
        </Route>
        <Route path="/login">
          <Login notification={notification}></Login>
        </Route>
        <Route path="/">
          <Togglable buttonLabel="create new blog">
            <NewBlog user={user} />
          </Togglable>

          <BlogList user={user} blogs={blogs} />
        </Route>
      </Switch>
    </div>
  )
}

export default App
