import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { initialiseBlogList } from '../reducers/blogListReducer'
import { makeStyles } from '@material-ui/core/styles'
import {
  Typography,
  Paper,
  TableContainer,
  TableRow,
  TableCell,
  TableBody,
  Table,
} from '@material-ui/core'
import { Link } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
  title: {
    margin: theme.spacing(4, 0, 2),
  },
}))

const BlogList = ({ blogs }) => {
  const dispatch = useDispatch()
  const classes = useStyles()

  useEffect(() => {
    dispatch(initialiseBlogList())
  }, [dispatch])

  const byLikes = (b1, b2) => b2.likes - b1.likes

  return (
    <div>
      <Typography variant="h6" className={classes.title}>
        Blog List
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {blogs.sort(byLikes).map((blog) => (
              <TableRow key={blog.id}>
                <TableCell>
                  <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
                </TableCell>
                <TableCell>{blog.author}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default BlogList
