import blogService from '../services/blogs'
import { notifyWith } from './notificationReducer'
import { toggleVisibility } from './visibilyReducer'

const blogListReducer = (state = [], action) => {
  switch (action.type) {
    case 'INIT_BLOG_LIST':
      return action.blogs
    case 'ADD_BLOG':
      return [...state, action.blog]
    case 'UPDATE': {
      const updatedBlog = action.data
      const blogs = state.map((blog) =>
        blog.id === updatedBlog.id ? updatedBlog : blog
      )
      return blogs
    }
    case 'REMOVE_BLOG': {
      const id = action.id
      const blogs = state.filter((b) => b.id !== id)
      return blogs
    }
    default:
      return state
  }
}

export const initialiseBlogList = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch({
      type: 'INIT_BLOG_LIST',
      blogs,
    })
  }
}

export const addNewBlog = (blog, user) => {
  return async (dispatch) => {
    const newBlog = await blogService.create(blog)
    dispatch({
      type: 'ADD_BLOG',
      blog: {
        ...newBlog,
        user: {
          id: newBlog.user,
          name: user.name,
          username: user.username,
        },
      },
    })
    dispatch(
      notifyWith(`a new blog '${newBlog.title}' by ${newBlog.author} added!`, 5)
    )
    dispatch(toggleVisibility())
  }
}

export const updateLike = (id, blogs) => {
  return async (dispatch) => {
    const blogToLike = blogs.find((b) => b.id === id)
    const likedBlog = {
      ...blogToLike,
      likes: blogToLike.likes + 1,
      user: blogToLike.user.id,
    }
    const updatedBlog = await blogService.update(likedBlog)
    dispatch({
      type: 'UPDATE',
      data: { ...blogToLike, likes: updatedBlog.likes },
    })
  }
}

export const removeBlog = (id, blogs) => {
  return async (dispatch) => {
    const blogToRemove = blogs.find((b) => b.id === id)
    const ok = window.confirm(
      `Remove blog ${blogToRemove.title} by ${blogToRemove.author}`
    )
    if (ok) {
      await blogService.remove(id)
      dispatch({
        type: 'REMOVE_BLOG',
        id,
      })
    }
  }
}

export const updateWithComment = (id, newComment, blogs) => {
  return async (dispatch) => {
    const blogToUpdate = blogs.find((b) => b.id === id)

    // this becomes the content of request.body
    // at backend
    const blogUpdate = {
      id: blogToUpdate.id,
      newComment,
    }
    const config = { isComment: true }
    const updatedBlog = await blogService.update(blogUpdate, config)
    dispatch({
      type: 'UPDATE',
      data: { ...blogToUpdate, comments: updatedBlog.comments },
    })
  }
}

export default blogListReducer
