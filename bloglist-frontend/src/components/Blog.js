import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import {
  removeBlog,
  updateLike,
  updateWithComment,
} from '../reducers/blogListReducer'
import { useHistory } from 'react-router-dom'
import {
  Button,
  Card,
  CardActions,
  CardContent,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core'

const Blog = ({ blog, blogs, user }) => {
  const [comment, setComment] = useState('')
  const dispatch = useDispatch()
  const history = useHistory()

  const handleLike = (id, blogs) => {
    dispatch(updateLike(id, blogs))
  }

  const handleRemove = (id, blogs) => {
    dispatch(removeBlog(id, blogs))
    history.push('/')
  }

  const handleAddComment = (id, comment, blogs) => {
    dispatch(updateWithComment(id, comment, blogs))
    setComment('')
  }

  const own = user.username === blog.user.username
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h2">
          {blog.title}
        </Typography>
        <Typography>
          <a href={blog.url}>{blog.url}</a>
        </Typography>
        <Typography>likes {blog.likes}</Typography>
        <Typography>{blog.user.name}</Typography>
        <CardActions>
          <Button variant="outlined" onClick={() => handleLike(blog.id, blogs)}>
            like
          </Button>
          {own && (
            <Button
              variant="outlined"
              onClick={() => handleRemove(blog.id, blogs)}
            >
              remove
            </Button>
          )}
        </CardActions>
      </CardContent>
      <div>
        <div>
          <TextField
            id="standard-multiline-static"
            label="Comments"
            multiline
            rows={4}
            value={comment}
            onChange={(event) => setComment(event.target.value)}
          />
          <div>
            <Button
              variant="outlined"
              onClick={() => handleAddComment(blog.id, comment, blogs)}
            >
              add comment
            </Button>
          </div>
        </div>
        <div>
          {blog.comments.length > 0 ? (
            <div>
              <Typography variant="h6" component="h4">
                comments
              </Typography>
              <List>
                {blog.comments.map((comment, i) => (
                  <ListItem key={i}>
                    <ListItemText primary={comment} />
                  </ListItem>
                ))}
              </List>
            </div>
          ) : null}
        </div>
      </div>
    </Card>
  )
}

export default Blog
